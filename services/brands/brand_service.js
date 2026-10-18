const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../../models/brands/brand_model");
const ApiError = require("../../utils/api_error");
const handelerFactory = require("../handlerer_factory");
const sharp = require("sharp");
const {
  uploadSingleImage,
} = require("../../middlewares/upload_single_image_middleware");
exports.uploadBrandImage = uploadSingleImage("image");
exports.imageProcessing = exports.imageProcessing = asyncHandler(
  async (req, res, next) => {
    const format = "jpeg";
    const filename = `brand-${req.user.id}-${Date.now()}.${format}`;
    await sharp(req.file.buffer)
      .resize(900, 600)
      .toFormat(format)
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
    next();
  },
);

exports.createBrand = asyncHandler(async (req, res) => {
  const brand = await BrandModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(201).json({ data: brand });
});
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, data: brands });
});
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getBrandById = await BrandModel.findById(id);
  if (!getBrandById) {
    return next(new ApiError(`Brand not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: getBrandById });
});
exports.updateBrand = handelerFactory.updateOne(BrandModel);
exports.deleteBrand = handelerFactory.deleteOne(BrandModel);
