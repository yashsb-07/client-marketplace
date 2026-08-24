const { param } = require("express-validator");

const userIdValidation = [
  param("userId")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

module.exports = {
  userIdValidation,
};