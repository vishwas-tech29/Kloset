import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth-helpers';
import { checkRateLimit, checkoutRateLimit } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const checkoutSchema = z.object({
  orderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const user = await requireAuth();
    const { success } = await checkRateLimit(user.id, checkoutRateLimit);
    
    if (!success) {
      return errorResponse('Too many checkout attempts. Please try again later.', 429);
    }

    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(errors as Record<string, string[]>);
    }

    const { orderId } = validation.data;

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    if (order.stripePaymentId) {
      return errorResponse('Order already has a payment session', 400);
    }

    // Create Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as line item
    if (Number(order.shippingCost) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(Number(order.shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as line item
    if (Number(order.tax) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(Number(order.tax) * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?canceled=true`,
      customer_email: user.email,
      client_reference_id: orderId,
      metadata: {
        orderId,
        userId: user.id,
      },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentId: session.id },
    });

    return successResponse({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to create checkout session', 500);
  }
}
