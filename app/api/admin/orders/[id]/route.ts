import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '@/lib/api/response';
import { requireAdmin } from '@/lib/api/auth-helpers';

// PUT /api/admin/orders/[id] - Update order status (Admin only)
const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = updateOrderSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(errors as Record<string, string[]>);
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return notFoundResponse('Order not found');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
        shippingAddress: true,
      },
    });

    // TODO: Send email notification based on status change
    // if (validation.data.status === 'SHIPPED') {
    //   await sendShippingEmail(updatedOrder);
    // }

    return successResponse(updatedOrder);
  } catch (error: any) {
    console.error('Order update error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return errorResponse(error.message, 403);
    }
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to update order', 500);
  }
}
