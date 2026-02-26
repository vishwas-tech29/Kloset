import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PROCESSING',
              stripePaymentId: payment.id,
            },
          });

          // Decrement stock
          const orderItems = await prisma.orderItem.findMany({
            where: { orderId },
          });

          await Promise.all(
            orderItems.map((item) =>
              prisma.variant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              })
            )
          );

          console.log(`Payment captured for order ${orderId}`);
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          });

          console.log(`Payment failed for order ${orderId}`);
        }
        break;
      }

      case 'refund.created': {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;

        // Find order by payment ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentId: paymentId },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'REFUNDED' },
          });

          // Restore stock
          const orderItems = await prisma.orderItem.findMany({
            where: { orderId: order.id },
          });

          await Promise.all(
            orderItems.map((item) =>
              prisma.variant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              })
            )
          );

          console.log(`Refund processed for order ${order.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
