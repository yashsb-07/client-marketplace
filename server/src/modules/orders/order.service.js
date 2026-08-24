const prisma = require("../../config/prisma");

const createOrderFromCart = async (buyerId) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: {
        buyerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      const error = new Error("Your cart is empty");
      error.statusCode = 400;
      throw error;
    }

    let subtotal = 0;

    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = await tx.product.findUnique({
        where: {
          id: cartItem.productId,
        },
      });

      if (!product) {
        const error = new Error(
          `Product ${cartItem.productId} no longer exists`
        );
        error.statusCode = 409;
        throw error;
      }

      if (!product.isVisible) {
        const error = new Error(
          `Product "${product.name}" is no longer available`
        );
        error.statusCode = 409;
        throw error;
      }

      if (product.quantity <= 0) {
        const error = new Error(
          `Product "${product.name}" is out of stock`
        );
        error.statusCode = 409;
        throw error;
      }

      if (cartItem.quantity > product.quantity) {
        const error = new Error(
          `Only ${product.quantity} item(s) of "${product.name}" are currently available`
        );
        error.statusCode = 409;
        throw error;
      }

      const unitPrice = Number(product.price);
      const itemTotal = unitPrice * cartItem.quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        sellerId: product.sellerId,
        productName: product.name,
        quantity: cartItem.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      });
    }

    const order = await tx.order.create({
      data: {
        buyerId,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        subtotal,
        total: subtotal,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
};

const getBuyerOrders = async (buyerId) => {
  return prisma.order.findMany({
    where: {
      buyerId,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getBuyerOrderById = async (buyerId, orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      buyerId,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

module.exports = {
  createOrderFromCart,
  getBuyerOrders,
  getBuyerOrderById,
};