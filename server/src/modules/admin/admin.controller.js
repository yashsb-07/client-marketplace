const {
  getDashboard,
  getUsersByRole,
  getProducts,
  getOrders,
  getPayments,
  setUserBlockedStatus,
} = require("./admin.service");

const dashboard = async (req, res, next) => {
  try {
    const data = await getDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getSellers = async (req, res, next) => {
  try {
    const sellers = await getUsersByRole("SELLER");

    return res.status(200).json({
      success: true,
      data: sellers,
    });
  } catch (error) {
    next(error);
  }
};

const getBuyers = async (req, res, next) => {
  try {
    const buyers = await getUsersByRole("BUYER");

    return res.status(200).json({
      success: true,
      data: buyers,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await getProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await getPayments();

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const user = await setUserBlockedStatus(
      req.user.userId,
      Number(req.params.userId),
      true
    );

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const user = await setUserBlockedStatus(
      req.user.userId,
      Number(req.params.userId),
      false
    );

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  getSellers,
  getBuyers,
  getAllProducts,
  getAllOrders,
  getAllPayments,
  blockUser,
  unblockUser,
};