import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAdmin } from '@/lib/api/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {
      status: {
        in: ['PROCESSING', 'SHIPPED', 'DELIVERED'],
      },
    };

    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
    }

    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    }

    // Get revenue data
    const orders = await prisma.order.findMany({
      where,
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const revenueByDate = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(order.total);
      return acc;
    }, {});

    const data = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    return successResponse({
      data,
      totalRevenue,
      orderCount: orders.length,
    });
  } catch (error: any) {
    console.error('Revenue analytics error:', error);
    
    if (error.message === 'Forbidden: Admin access required') {
      return errorResponse(error.message, 403);
    }
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    
    return errorResponse('Failed to fetch revenue analytics', 500);
  }
}
