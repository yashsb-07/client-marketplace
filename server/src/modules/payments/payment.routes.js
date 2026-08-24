const express = require("express");

const {
  processPayment,
  getPayment,
} = require("./payment.controller");

const {
  paymentValidation,
  orderIdValidation,
} = require("./payment.validation");

const validateRequest = require("../../middleware/validation.middleware");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("BUYER"));

router.post(
  "/:orderId",
  orderIdValidation,
  paymentValidation,
  validateRequest,
  processPayment
);

router.get(
  "/:orderId",
  orderIdValidation,
  validateRequest,
  getPayment
);

module.exports = router;