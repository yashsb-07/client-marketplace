const { body, param } = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),

  body("categoryId")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a valid number"),

  body("imageUrl")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Image URL must be a valid URL"),
];

const productIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a valid number"),
];

module.exports = {
  createProductValidation,
  productIdValidation,
};