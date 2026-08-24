const {
  createOrderFromCart,
  getBuyerOrders,
  getBuyerOrderById,
} = require("./order.service");

const create = async (req, res, next) => {
  try {
    const order = await createOrderFromCart(
      req.user.userId
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const orders = await getBuyerOrders(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await getBuyerOrderById(
      req.user.userId,
      Number(req.params.orderId)
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
};