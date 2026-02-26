const { PrismaClient } = require('../../../node_modules/@prisma/client');
const prisma = new PrismaClient();

/**
 * Get new orders since last check
 */
const getNewOrders = async (since) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gt: since },
        status: 'PENDING'
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching new orders:', error);
    return [];
  }
};

/**
 * Get all orders with filters
 */
const getOrders = async (filters = {}) => {
  const { status, startDate, endDate, search, limit = 50, offset = 0 } = filters;

  const where = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  if (search) {
    where.OR = [
      { id: { contains: search } },
      { guestName: { contains: search } },
      { guestEmail: { contains: search } }
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.order.count({ where })
  ]);

  return { orders, total };
};

/**
 * Get single order by ID
 */
const getOrderById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  });
};

/**
 * Update order status
 */
const updateOrderStatus = async (orderId, status, notes = null) => {
  const updateData = { status };
  if (notes) updateData.notes = notes;

  return await prisma.order.update({
    where: { id: orderId },
    data: updateData
  });
};

/**
 * Get dashboard stats
 */
const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    newOrdersToday,
    pendingOrders,
    processingOrders,
    totalRevenue,
    recentOrders
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: today },
        status: 'PENDING'
      }
    }),
    prisma.order.count({
      where: { status: 'PENDING' }
    }),
    prisma.order.count({
      where: { status: 'PROCESSING' }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] }
      }
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          take: 1,
          include: { product: true }
        }
      }
    })
  ]);

  return {
    newOrdersToday,
    pendingOrders,
    processingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders
  };
};

module.exports = {
  getNewOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
};
