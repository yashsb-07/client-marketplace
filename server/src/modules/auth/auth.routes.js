const express = require("express");

const {
  register,
  login,
  getMe,
} = require("./auth.controller");

const {
  registerValidation,
  loginValidation,
} = require("./auth.validation");

const validateRequest = require("../../middleware/validation.middleware");
const { authenticate } = require("../../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

router.get(
  "/me",
  authenticate,
  getMe
);

module.exports = router;