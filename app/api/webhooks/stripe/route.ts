import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api/response';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('Missing stripe signature', 400);
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return errorResponse(`Webhook Error: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'PROCESSING',
              stripePaymentId: session.payment_intent as string,
            },
          });

          // TODO: Send order confirmation email
          console.log(`Order ${orderId} confirmed`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentId: paymentIntent.id },
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
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

          console.log(`Order ${order.id} cancelled due to payment failure`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Find order by payment intent ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentId: charge.payment_intent as string },
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

          console.log(`Order ${order.id} refunded`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse('Webhook handler failed', 500);
  }
}
