import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth-helpers';

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const user = await requireAuth();

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
            category: true,
            variants: {
              select: {
                stock: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const wishlistWithStock = wishlist.map((item) => ({
      ...item,
      product: {
        ...item.product,
        inStock: item.product.variants.some((v) => v.stock > 0),
      },
    }));

    return successResponse(wishlistWithStock);
  } catch (error: any) {
    console.error('Wishlist fetch error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to fetch wishlist', 500);
  }
}

// POST /api/wishlist - Add item to wishlist
const addToWishlistSchema = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    
    const validation = addToWishlistSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(errors as Record<string, string[]>);
    }

    const { productId } = validation.data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      return errorResponse('Product already in wishlist', 400);
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return successResponse(wishlistItem, 201);
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to add to wishlist', 500);
  }
}
