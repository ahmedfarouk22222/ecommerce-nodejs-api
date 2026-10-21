const { check } = require("express-validator");
const { body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleWere = require("../../../middlewares/validator_middleware");
const ReviewModel = require("../../../models/reviews/review_model");

exports.createReviewValidator = [
  check("title").optional(),

  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be between 1 and 5"),

  check("product")
    .notEmpty()
    .withMessage("Review product is required")
    .isMongoId()
    .withMessage("Invalid product ID")
    .bail()
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findOne({
        user: req.user.id,
        product: val,
      });

      if (review) {
        throw new Error("You have already reviewed this product");
      }
    }),

  validatorMiddleWere,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review Id"),
  validatorMiddleWere,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .bail()
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findById(val);

      if (!review) {
        throw new Error("Review not found");
      }

      if (review.user.toString() !== req.user.id.toString()) {
        throw new Error("You are not allowed to update this review");
      }

      return true;
    }),

  validatorMiddleWere,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID")
    .bail()
    .custom(async (val, { req }) => {
      const review = await ReviewModel.findById(val);

      if (!review) {
        throw new Error("Review not found");
      }

      if (
        req.user.role === "user" &&
        review.user.toString() !== req.user.id.toString()
      ) {
        throw new Error("You are not allowed to delete this review");
      }

      return true;
    }),

  validatorMiddleWere,
];
