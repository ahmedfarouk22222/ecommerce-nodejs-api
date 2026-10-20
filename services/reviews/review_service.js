const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ReviewModel = require("../../models/reviews/review_model");
const ApiError = require("../../utils/api_error");
const handelerFactory = require("../handlerer_factory");

exports.createReview = asyncHandler(async (req, res) => {
  const Review = await ReviewModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(201).json({ data: Review });
});
exports.getReviews = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const Reviews = await ReviewModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: Reviews.length, data: Reviews });
});
exports.getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getReviewById = await ReviewModel.findById(id);
  if (!getReviewById) {
    return next(
      new ApiError(
        `Review
         not found by this id: ${id}`,
        404,
      ),
    );
  }
  res.status(200).json({ data: getBrandById });
});
exports.updateReview = handelerFactory.updateOne(ReviewModel);
exports.deleteReview = handelerFactory.deleteOne(ReviewModel);
