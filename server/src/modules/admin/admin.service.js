const prisma = require("../../config/prisma");

const getDashboard = async () => {
  const [
    sellers,
    buyers,
    products,
    orders,
    successfulPayments,
    pendingPayments,
    revenue,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "SELLER",
      },
    }),

    prisma.user.count({
      where: {
        role: "BUYER",
      },
    }),

    prisma.product.count(),

    prisma.order.count(),

    prisma.payment.count({
      where: {
        status: "SUCCESS",
      },
    }),

    prisma.payment.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    sellers,
    buyers,
    products,
    orders,
    successfulPayments,
    pendingPayments,
    revenue: revenue._sum.amount || 0,
  };
};

const getUsersByRole = async (role) => {
  return prisma.user.findMany({
    where: {
      role,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,

      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          isBlocked: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getOrders = async () => {
  return prisma.order.findMany({
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      items: {
        orderBy: {
          createdAt: "asc",
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPayments = async () => {
  return prisma.payment.findMany({
    include: {
      order: {
        select: {
          id: true,
          buyerId: true,
          status: true,
          paymentStatus: true,
          total: true,

          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const setUserBlockedStatus = async (
  adminId,
  userId,
  isBlocked
) => {
  /*
   * Prevent an admin from blocking/unblocking
   * their own account.
   */
  if (adminId === userId) {
    const error = new Error(
      "Admin cannot block or unblock their own account"
    );

    error.statusCode = 400;

    throw error;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");

    error.statusCode = 404;

    throw error;
  }

  /*
   * Admin accounts cannot be managed
   * through this endpoint.
   */
  if (user.role === "ADMIN") {
    const error = new Error(
      "Admin accounts cannot be managed through this endpoint"
    );

    error.statusCode = 403;

    throw error;
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      isBlocked,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      updatedAt: true,
    },
  });
};

module.exports = {
  getDashboard,
  getUsersByRole,
  getProducts,
  getOrders,
  getPayments,
  setUserBlockedStatus,
};