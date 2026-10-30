const express = require("express");

const {
  addProductToCart,
  getLogedUserCart,
  applyCoupon,
} = require("../../services/cart/cart_service");
// const {
//   createBrandValidator,
//   getBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../../utils/validators/brand/brand_validator");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");
router.use(AuthService.protect, AuthService.allowedTo("user"));

router.route("/").post(addProductToCart).get(getLogedUserCart);
router.route("/applyCoupon").put(applyCoupon);
//   .get(getBrands);
// router
//   .route("/:id")
//   .get(getBrandValidator, getBrandById)
//   .put(
//     AuthService.protect,
//     AuthService.allowedTo("admin", "manager"),
//     uploadBrandImage,
//     imageProcessing,
//     updateBrandValidator,
//     updateBrand,
//   )
//   .delete(
//     AuthService.protect,
//     AuthService.allowedTo("admin"),
//     deleteBrandValidator,
//     deleteBrand,
//   );

module.exports = router;
