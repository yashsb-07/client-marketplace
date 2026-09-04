const express = require("express");

const {
  getProducts,
  getProductById,
  getCategories,
} = require("./marketplace.controller");

const router = express.Router();

router.get("/categories", getCategories);

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

module.exports = router;