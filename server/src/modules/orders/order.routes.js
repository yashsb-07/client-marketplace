const express = require("express");

const {
  create,
  getAll,
  getById,
} = require("./order.controller");

const {
  createOrderValidation,
  orderIdValidation,
} = require("./order.validation");

const validateRequest = require("../../middleware/validation.middleware");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("BUYER"));

router.post(
  "/",
  createOrderValidation,
  validateRequest,
  create
);

router.get("/", getAll);

router.get(
  "/:orderId",
  orderIdValidation,
  validateRequest,
  getById
);

module.exports = router;