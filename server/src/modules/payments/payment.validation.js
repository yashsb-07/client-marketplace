const { body, param } = require("express-validator");

const paymentValidation = [
  body("outcome")
    .isIn(["SUCCESS", "FAILED", "CANCELLED"])
    .withMessage(
      "outcome must be SUCCESS, FAILED, or CANCELLED"
    ),
];

const orderIdValidation = [
  param("orderId")
    .isInt({ min: 1 })
    .withMessage("orderId must be a positive integer"),
];

module.exports = {
  paymentValidation,
  orderIdValidation,
};