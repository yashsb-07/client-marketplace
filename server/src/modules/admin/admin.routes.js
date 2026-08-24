const express = require("express");

const {
  dashboard,
  getSellers,
  getBuyers,
  getAllProducts,
  getAllOrders,
  getAllPayments,
  blockUser,
  unblockUser,
} = require("./admin.controller");

const {
  userIdValidation,
} = require("./admin.validation");

const validateRequest = require("../../middleware/validation.middleware");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

/*
 * Every Admin endpoint requires:
 *
 * 1. Valid JWT
 * 2. ADMIN role
 */
router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/dashboard", dashboard);

router.get("/sellers", getSellers);

router.get("/buyers", getBuyers);

router.get("/products", getAllProducts);

router.get("/orders", getAllOrders);

router.get("/payments", getAllPayments);

router.patch(
  "/users/:userId/block",
  userIdValidation,
  validateRequest,
  blockUser
);

router.patch(
  "/users/:userId/unblock",
  userIdValidation,
  validateRequest,
  unblockUser
);

module.exports = router;