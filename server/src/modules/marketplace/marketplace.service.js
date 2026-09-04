const prisma = require("../../config/prisma");

const getPublicProducts = async ({
  page = 1,
  limit = 12,
  search,
  categoryId,
  minPrice,
  maxPrice,
  available,
  sort,
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

  // Search
  if (search && search.trim()) {
    const searchTerm = search.trim();

    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        category: {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  // Category filter
  if (categoryId !== undefined) {
    const parsedCategoryId = Number(categoryId);

    if (!Number.isNaN(parsedCategoryId)) {
      where.categoryId = parsedCategoryId;
    }
  }

  // Minimum price
  if (minPrice !== undefined) {
    const parsedMinPrice = Number(minPrice);

    if (!Number.isNaN(parsedMinPrice)) {
      where.price = {
        ...(where.price || {}),
        gte: parsedMinPrice,
      };
    }
  }

  // Maximum price
  if (maxPrice !== undefined) {
    const parsedMaxPrice = Number(maxPrice);

    if (!Number.isNaN(parsedMaxPrice)) {
      where.price = {
        ...(where.price || {}),
        lte: parsedMaxPrice,
      };
    }
  }

  // Availability filter
  if (available === "true") {
    where.quantity = {
      gt: 0,
    };
  }

  if (available === "false") {
    where.quantity = {
      equals: 0,
    };
  }

  // Sorting
  let orderBy = {
    createdAt: "desc",
  };

  if (sort === "oldest") {
    orderBy = {
      createdAt: "asc",
    };
  }

  if (sort === "price_asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price_desc") {
    orderBy = {
      price: "desc",
    };
  }

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
      orderBy,
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

const getPublicCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

module.exports = {
  getPublicProducts,
  getPublicProductById,
  getPublicCategories,
};