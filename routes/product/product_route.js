const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../../utils/validators/product/product_validator");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProducts,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} = require("../../services/product/product_service");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    createProduct,
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProducts,
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct,
  );

module.exports = router;
