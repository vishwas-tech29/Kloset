import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/api/response';
import { requireAdmin } from '@/lib/api/auth-helpers';

// GET /api/products/[slug] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        tags: true,
        variants: {
          orderBy: [{ color: 'asc' }, { size: 'asc' }],
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return notFoundResponse('Product not found');
    }

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: {
        productId: product.id,
        isApproved: true,
      },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    const productWithRating = {
      ...product,
      rating: avgRating._avg.rating || 0,
      reviewCount: avgRating._count,
      inStock: product.variants.some((v) => v.stock > 0),
    };

    return successResponse(productWithRating);
  } catch (error) {
    console.error('Product fetch error:', error);
    return errorResponse('Failed to fetch product', 500);
  }
}

// PUT /api/products/[slug] - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { tags, images, variants, ...productData } = body;

    // Find product by slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!existingProduct) {
      return notFoundResponse('Product not found');
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img: any, index: number) => ({
              url: img.url,
              publicId: img.publicId,
              order: index,
            })),
          },
        }),
        ...(variants && {
          variants: {
            deleteMany: {},
            create: variants,
          },
        }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: {
        images: true,
        variants: true,
        category: true,
        tags: true,
      },
    });

    return successResponse(product);
  } catch (error: any) {
    console.error('Product update error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return errorResponse(error.message, 403);
    }
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to update product', 500);
  }
}

// DELETE /api/products/[slug] - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin();

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!product) {
      return notFoundResponse('Product not found');
    }

    await prisma.product.delete({
      where: { id: product.id },
    });

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Product deletion error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return errorResponse(error.message, 403);
    }
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to delete product', 500);
  }
}
