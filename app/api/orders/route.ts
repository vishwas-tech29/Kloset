import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth-helpers';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            variant: {
              select: {
                size: true,
                color: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(orders);
  } catch (error: any) {
    console.error('Orders fetch error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to fetch orders', 500);
  }
}

// POST /api/orders - Create order
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().int().positive(),
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  shippingMethod: z.string(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(errors as Record<string, string[]>);
    }

    const { items, shippingAddress, shippingMethod, couponCode, notes } = validation.data;

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

    // Create address
    const address = await prisma.address.create({
      data: {
        ...shippingAddress,
        userId: user.id,
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        addressId: address.id,
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
        shippingAddress: true,
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

    return successResponse(order, 201);
  } catch (error: any) {
    console.error('Order creation error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse(error.message || 'Failed to create order', 500);
  }
}
