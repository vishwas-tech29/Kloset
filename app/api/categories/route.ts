import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api/response';
import { requireAdmin } from '@/lib/api/auth-helpers';

// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}

// POST /api/categories - Create category (Admin only)
const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().optional(),
  order: z.number().int().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return validationErrorResponse(errors as Record<string, string[]>);
    }

    const category = await prisma.category.create({
      data: validation.data,
    });

    return successResponse(category, 201);
  } catch (error: any) {
    console.error('Category creation error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return errorResponse(error.message, 403);
    }
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to create category', 500);
  }
}
