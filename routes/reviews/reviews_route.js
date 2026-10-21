const express = require("express");

const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../../services/reviews/review_service");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../../utils/validators/review/review_validator");
const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    createReviewValidator,
    createReview,
  )
  .get(getReviews);
router
  .route("/:id")
  .get(AuthService.allowedTo("admin"), getReviewById)
  .put(
    AuthService.protect,
    AuthService.allowedTo("user"),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "User"),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
