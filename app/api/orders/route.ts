import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// POST /api/orders - Create guest order
const createOrderSchema = z.object({
  guestEmail: z.string().email(),
  guestName: z.string().min(1),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  shippingMethod: z.string(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { guestEmail, guestName, items, shippingAddress, shippingMethod, couponCode, notes } = validation.data;

    // Fetch products and variants
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        });

        const variant = await prisma.variant.findUnique({
          where: { id: item.variantId },
        });

        if (!product || !variant) {
          throw new Error('Product or variant not found');
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        return {
          productId: product.id,
          variantId: variant.id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          image: product.images[0]?.url || '',
        };
      })
    );

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, isActive: true },
      });

      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * Number(coupon.value)) / 100;
        } else {
          discount = Number(coupon.value);
        }

        // Update coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const shippingCost = shippingMethod === 'express' ? 15.99 : subtotal > 50 ? 0 : 5.99;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + shippingCost + tax;

    // Create order
    const order = await prisma.order.create({
      data: {
        guestEmail,
        guestName,
        status: 'PENDING',
        shippingAddress: JSON.stringify(shippingAddress),
        shippingMethod,
        shippingCost,
        subtotal,
        discount,
        tax,
        total,
        couponCode,
        notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Decrease stock
    await Promise.all(
      items.map((item) =>
        prisma.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
