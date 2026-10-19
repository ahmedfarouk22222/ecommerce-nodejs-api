const multer = require("multer");
const slugify = require("slugify");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../../models/product/product_model");
const ApiError = require("../../utils/api_error");
const { query } = require("express-validator");
const ApiFeature = require("../../utils/api_feature");
const handelerFactory = require("../handlerer_factory");

const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      }),
    );
    next();
  }
});

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
