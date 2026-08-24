const prisma = require("../../config/prisma");

const getOrCreateCart = async (buyerId) => {
  let cart = await prisma.cart.findUnique({
    where: {
      buyerId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        buyerId,
      },
    });
  }

  return cart;
};

const getCart = async (buyerId) => {
  const cart = await getOrCreateCart(buyerId);

  return prisma.cart.findUnique({
    where: {
      id: cart.id,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

const addCartItem = async (
  buyerId,
  productId,
  quantity
) => {
  const cart = await getOrCreateCart(buyerId);

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isVisible: true,
    },
    include: {
      category: true,
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    const error = new Error(
      "Product is not available"
    );
    error.statusCode = 404;
    throw error;
  }

  if (product.quantity <= 0) {
    const error = new Error(
      "Product is out of stock"
    );
    error.statusCode = 409;
    throw error;
  }

  const existingItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

  const requestedQuantity =
    existingItem
      ? existingItem.quantity + quantity
      : quantity;

  if (requestedQuantity > product.quantity) {
    const error = new Error(
      `Only ${product.quantity} item(s) are currently available`
    );
    error.statusCode = 409;
    throw error;
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: requestedQuantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getCart(buyerId);
};

const updateCartItem = async (
  buyerId,
  productId,
  quantity
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      buyerId,
    },
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const cartItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

  if (!cartItem) {
    const error = new Error(
      "Product is not in your cart"
    );
    error.statusCode = 404;
    throw error;
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isVisible: true,
    },
  });

  if (!product) {
    const error = new Error(
      "Product is no longer available"
    );
    error.statusCode = 409;
    throw error;
  }

  if (quantity > product.quantity) {
    const error = new Error(
      `Only ${product.quantity} item(s) are currently available`
    );
    error.statusCode = 409;
    throw error;
  }

  await prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity,
    },
  });

  return getCart(buyerId);
};

const removeCartItem = async (
  buyerId,
  productId
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      buyerId,
    },
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const cartItem =
    await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

  if (!cartItem) {
    const error = new Error(
      "Product is not in your cart"
    );
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItem.id,
    },
  });

  return getCart(buyerId);
};

const clearCart = async (buyerId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      buyerId,
    },
  });

  if (!cart) {
    return {
      id: null,
      buyerId,
      items: [],
    };
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return getCart(buyerId);
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
};