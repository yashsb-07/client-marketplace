const {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("./cart.service");

const get = async (req, res, next) => {
  try {
    const cart = await getCart(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await addCartItem(
      req.user.userId,
      Number(req.body.productId),
      Number(req.body.quantity)
    );

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const cart = await updateCartItem(
      req.user.userId,
      Number(req.params.productId),
      Number(req.body.quantity)
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await removeCartItem(
      req.user.userId,
      Number(req.params.productId)
    );

    return res.status(200).json({
      success: true,
      message: "Cart item removed",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const clear = async (req, res, next) => {
  try {
    const cart = await clearCart(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  addItem,
  updateItem,
  removeItem,
  clear,
};