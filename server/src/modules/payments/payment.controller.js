const {
  processDemoPayment,
  getBuyerPaymentByOrderId,
} = require("./payment.service");

const processPayment = async (req, res, next) => {
  try {
    const payment = await processDemoPayment(
      req.user.userId,
      Number(req.params.orderId),
      req.body.outcome
    );

    return res.status(200).json({
      success: true,
      message: "Demo payment processed successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await getBuyerPaymentByOrderId(
      req.user.userId,
      Number(req.params.orderId)
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  getPayment,
};