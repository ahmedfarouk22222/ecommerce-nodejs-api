const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../../models/category/category_model");
const ApiError = require("../../utils/api_error");
const handelerFactory = require("../handlerer_factory");
const multer = require("multer");
const sharp = require("sharp");
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     filename = `category-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const format = "jpeg";
  const filename = `category-${req.user.id}-${Date.now()}.${format}`;
  await sharp(req.file.buffer)
    .resize(900, 600)
    .toFormat(format)
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});
exports.uploadCategoryImage = upload.single("image");
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
exports.updateCategory = handelerFactory.updateOne(CategoryModel);

exports.deleteCategory = handelerFactory.deleteOne(CategoryModel);

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(201).json({ data: category });
});
