const { body, param } = require("express-validator");

const createOrderValidation = [
  body("confirm")
    .optional()
    .isBoolean()
    .withMessage("confirm must be a boolean"),
];

const orderIdValidation = [
  param("orderId")
    .isInt({ min: 1 })
    .withMessage("orderId must be a positive integer"),
];

module.exports = {
  createOrderValidation,
  orderIdValidation,
};