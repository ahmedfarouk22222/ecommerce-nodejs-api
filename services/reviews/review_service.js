const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ReviewModel = require("../../models/reviews/review_model");
const ApiError = require("../../utils/api_error");
const handelerFactory = require("../handlerer_factory");
exports.createReview = asyncHandler(async (req, res) => {
  const review = await ReviewModel.create({
    title: req.body.title,
    rating: req.body.rating,
    product: req.body.product,
    user: req.user.id,
  });

  res.status(201).json({ data: review });
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
