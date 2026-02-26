import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get stats
    const [newOrdersToday, pendingOrders, processingOrders, completedOrders] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),
      prisma.order.count({
        where: {
          status: 'PROCESSING',
        },
      }),
      prisma.order.findMany({
        where: {
          status: {
            in: ['DELIVERED', 'COMPLETED'],
          },
        },
        select: {
          total: true,
        },
      }),
    ]);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({
      newOrdersToday,
      pendingOrders,
      processingOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
