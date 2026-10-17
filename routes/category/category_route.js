const express = require("express");
const multer = require("multer");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../../utils/validators/category/category_validator");
const {
  getCategories,
  createCategory,
  getcategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../../services/category/category_service");
const AuthService = require("../../services/auth/auth_service");

const router = express.Router();
const subCategoryRoute = require("./sub_category_route");
const upload = multer({ dest: "uploads/categories" });

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    (req, res, next) => {
      console.log(req.file);
      next();
    },
    createCategoryValidator,
    createCategory,
  );
router
  .route("/:id")
  .get(getCategoryValidator, getcategoryById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;
