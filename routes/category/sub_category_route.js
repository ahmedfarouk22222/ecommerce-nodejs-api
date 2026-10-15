const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../../utils/validators/category/sub_category_validator");

const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  setCategoryIdToBody,
  updateSubCategory,
  deleteSubCategory,
} = require("../../services/category/subcategory_service");

const router = express.Router({ mergeParams: true });
const AuthService = require("../../services/auth/auth_service");

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
