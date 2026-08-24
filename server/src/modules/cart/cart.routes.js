const express = require("express");

const {
  get,
  addItem,
  updateItem,
  removeItem,
  clear,
} = require("./cart.controller");

const {
  addCartItemValidation,
  updateCartItemValidation,
  cartProductIdValidation,
} = require("./cart.validation");

const validateRequest = require("../../middleware/validation.middleware");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("BUYER"));

router.get("/", get);

router.post(
  "/items",
  addCartItemValidation,
  validateRequest,
  addItem
);

router.patch(
  "/items/:productId",
  updateCartItemValidation,
  validateRequest,
  updateItem
);

router.delete(
  "/items/:productId",
  cartProductIdValidation,
  validateRequest,
  removeItem
);

router.delete("/", clear);

module.exports = router;