import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth-helpers';

// DELETE /api/wishlist/[productId] - Remove from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await requireAuth();

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.productId,
        },
      },
    });

    if (!wishlistItem) {
      return errorResponse('Item not in wishlist', 404);
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    return successResponse({ message: 'Removed from wishlist' });
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to remove from wishlist', 500);
  }
}
