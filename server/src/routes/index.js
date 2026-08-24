const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const productRoutes = require("../modules/products/product.routes");
const marketplaceRoutes = require("../modules/marketplace/marketplace.routes");
const cartRoutes = require("../modules/cart/cart.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/cart", cartRoutes);

module.exports = router;