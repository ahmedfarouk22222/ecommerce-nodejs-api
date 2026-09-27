const express = require("express");

const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require("../../utils/validators/category/sub_category_validator");

const {

    createSubCategory, getSubCategories, getSubCategoryById, setCategoryIdToBody, updateSubCategory, deleteSubCategory } = require("../../services/category/subcategory_service");

const router = express.Router({ mergeParams: true });
router.route('/').post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory).get(getSubCategories);
router.route('/:id').get(getSubCategoryValidator, getSubCategoryById).put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
