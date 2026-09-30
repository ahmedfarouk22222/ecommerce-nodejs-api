const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../../models/product/product_model");
const ApiError = require("../../utils/api_error");

exports.getProducts = asyncHandler(async (req, res) => {
  // filtering
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "limit", "sort", "fields"];
  excludesFields.forEach((field) => delete queryStringObj[field]);

  let queryString = JSON.stringify(queryStringObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );

  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  console.log(JSON.parse(queryString)); // ← ضيف السطر دا مؤقتًا
  const mongooseQuery = ProductModel.find(JSON.parse(queryString))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });

  const products = await mongooseQuery;
  res.status(200).json({ results: products.length, data: products });
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
exports.updateProducts = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const updateProduct = await ProductModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true },
  );
  if (!updateProduct) {
    return next(new ApiError(`Product not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: updateProduct });
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await ProductModel.findByIdAndDelete(id);

  if (!deleteProduct) {
    return next(new ApiError(`Product not found by this id: ${id}`, 404));
  }
  res.status(204).send();
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});
