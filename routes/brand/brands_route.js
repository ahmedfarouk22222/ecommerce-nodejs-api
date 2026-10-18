const express = require("express");

const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} = require("../../services/brands/brand_service");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../../utils/validators/brand/brand_validator");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand,
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand,
  );

module.exports = router;
