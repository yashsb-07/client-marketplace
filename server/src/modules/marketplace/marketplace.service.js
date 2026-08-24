const prisma = require("../../config/prisma");

const getPublicProducts = async ({
  page = 1,
  limit = 12,
}) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 12, 1),
    50
  );

  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    isVisible: true,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getPublicProductById = async (productId) => {
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
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

module.exports = {
  getPublicProducts,
  getPublicProductById,
};