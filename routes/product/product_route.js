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
} = require("../../services/product/product_service");

const router = express.Router();

router.route("/").post(createProductValidator, createProduct).get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(updateProductValidator, updateProducts)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
