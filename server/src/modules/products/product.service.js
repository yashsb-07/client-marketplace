const prisma = require("../../config/prisma");

const createProduct = async (sellerId, data) => {
  const {
    name,
    description,
    price,
    quantity,
    categoryId,
    imageUrl,
  } = data;

  const category = await prisma.category.findUnique({
    where: {
      id: Number(categoryId),
    },
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const product = await prisma.product.create({
    data: {
      sellerId,
      categoryId: Number(categoryId),
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      imageUrl: imageUrl || null,
    },
    include: {
      category: true,
    },
  });

  return product;
};

const getSellerProducts = async (sellerId) => {
  return prisma.product.findMany({
    where: {
      sellerId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSellerProductById = async (sellerId, productId) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const updateProduct = async (
  sellerId,
  productId,
  data
) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(data.categoryId),
      },
    });

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
  }

  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.price !== undefined) {
    updateData.price = Number(data.price);
  }

  if (data.quantity !== undefined) {
    updateData.quantity = Number(data.quantity);
  }

  if (data.categoryId !== undefined) {
    updateData.categoryId = Number(data.categoryId);
  }

  if (data.imageUrl !== undefined) {
    updateData.imageUrl = data.imageUrl || null;
  }

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: updateData,
    include: {
      category: true,
    },
  });

  return product;
};

const updateProductVisibility = async (
  sellerId,
  productId,
  isVisible
) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isVisible,
    },
    include: {
      category: true,
    },
  });
};

const deactivateProduct = async (
  sellerId,
  productId
) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      sellerId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      status: "INACTIVE",
      isVisible: false,
    },
    include: {
      category: true,
    },
  });
};

module.exports = {
  createProduct,
  getSellerProducts,
  getSellerProductById,
  updateProduct,
  updateProductVisibility,
  deactivateProduct,
};