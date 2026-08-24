const express = require("express");

const {
  create,
  getMine,
  getMineById,
  update,
  updateVisibility,
  deactivate,
  activate,
} = require("./product.controller");

const {
  createProductValidation,
  productIdValidation,
} = require("./product.validation");

const validateRequest = require("../../middleware/validation.middleware");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorize("SELLER"));

router.post(
  "/",
  createProductValidation,
  validateRequest,
  create
);

router.get("/mine", getMine);

router.get(
  "/mine/:id",
  productIdValidation,
  validateRequest,
  getMineById
);

router.put(
  "/:id",
  productIdValidation,
  validateRequest,
  update
);

router.patch(
  "/:id/visibility",
  productIdValidation,
  validateRequest,
  updateVisibility
);

router.patch(
  "/:id/deactivate",
  productIdValidation,
  validateRequest,
  deactivate
);

router.patch(
  "/:id/activate",
  productIdValidation,
  validateRequest,
  activate
);

module.exports = router;