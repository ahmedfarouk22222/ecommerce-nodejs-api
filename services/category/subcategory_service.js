const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const SubCategoryModel = require('../../models/category/sub_categpry_model');
const ApiError = require('../../utils/api_error');


exports.setCategoryIdToBody = async (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();

}
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { category } = req.body;
    const subCategory = await SubCategoryModel.create({ name, slug: slugify(name), category });
    res.status(201).json({ data: subCategory });
});
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }
    console.log(req.params);
    const subCategories = await SubCategoryModel.find(filterObject).skip(skip).limit(limit);
    res.status(200).json({ results: subCategories.length, data: subCategories });
});
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategoryById = await SubCategoryModel.findById(id);
    if (!subCategoryById) {
        return next(new ApiError(`Category not found by this id: ${id}`, 404));
    }
    res.status(200).json({ data: subCategoryById });
});
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const updateSubCategory = await SubCategoryModel.findOneAndUpdate(
        { _id: id },
        { name: name, slug: slugify(name), category },
        { new: true });
    if (!updateSubCategory) {
        return next(new ApiError(`SubCategory not found by this id: ${id}`, 404));
    }
    res.status(200).json({ data: updateSubCategory });

});
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deleteSubCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!deleteSubCategory) {
        return next(new ApiError(`SubCategory not found by this id: ${id}`, 404));
    }
    res.status(204).send();
});
