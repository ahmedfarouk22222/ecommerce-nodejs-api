const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../../models/category/category_model");
const ApiError = require("../../utils/api_error");
const deleteFactory = require("../delete_factory");

exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, data: categories });
});
exports.getcategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`Category not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateCategory = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    { new: true },
  );
  if (!updateCategory) {
    return next(new ApiError(`Category not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: updateCategory });
});
exports.deleteCategory = deleteFactory.deleteOne(CategoryModel);

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
