const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../../models/product/product_model");
const ApiError = require("../../utils/api_error");
const { query } = require("express-validator");
const ApiFeature = require("../../utils/api_feature");
const handelerFactory = require("../handlerer_factory");

exports.getProducts = asyncHandler(async (req, res) => {
  const countDocuments = await ProductModel.countDocuments();
  const apifeature = new ApiFeature(ProductModel.find(), req.query)
    .pagination(countDocuments)
    .filter()
    .search()
    .limitFields()
    .sort();

  //Execute the query
  const { mongooseQuery, paginationresult } = apifeature;
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ results: products.length, paginationresult, data: products });
});
exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getProduct = await ProductModel.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!getProduct) {
    return next(new ApiError(`Product not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: getProduct });
});
exports.updateProducts = handelerFactory.updateOne(ProductModel);
exports.deleteProduct = handelerFactory.deleteOne(ProductModel);

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});
