const {
  body,
  param,
} = require("express-validator");

const addCartItemValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

const updateCartItemValidation = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

const cartProductIdValidation = [
  param("productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),
];

module.exports = {
  addCartItemValidation,
  updateCartItemValidation,
  cartProductIdValidation,
};