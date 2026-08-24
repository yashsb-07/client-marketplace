const {
  createProduct,
  getSellerProducts,
  getSellerProductById,
  updateProduct,
  updateProductVisibility,
  deactivateProduct,
  activateProduct,
} = require("./product.service");

const create = async (req, res, next) => {
  try {
    const product = await createProduct(
      req.user.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getMine = async (req, res, next) => {
  try {
    const products = await getSellerProducts(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getMineById = async (req, res, next) => {
  try {
    const product = await getSellerProductById(
      req.user.userId,
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await updateProduct(
      req.user.userId,
      Number(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateVisibility = async (req, res, next) => {
  try {
    const { isVisible } = req.body;

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVisible must be true or false",
      });
    }

    const product = await updateProductVisibility(
      req.user.userId,
      Number(req.params.id),
      isVisible
    );

    return res.status(200).json({
      success: true,
      message: isVisible
        ? "Product is now visible"
        : "Product is now hidden",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deactivate = async (req, res, next) => {
  try {
    const product = await deactivateProduct(
      req.user.userId,
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const activate = async (req, res, next) => {
  try {
    const product = await activateProduct(
      req.user.userId,
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: "Product activated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getMine,
  getMineById,
  update,
  updateVisibility,
  deactivate,
  activate,
};