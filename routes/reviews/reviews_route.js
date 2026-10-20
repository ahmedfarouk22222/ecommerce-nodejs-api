const express = require("express");

const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../../services/reviews/review_service");

const router = express.Router();
const AuthService = require("../../services/auth/auth_service");

router.route("/").post(AuthService.protect, createReview).get(getReviews);
router
  .route("/:id")
  .get(AuthService.allowedTo("admin"), getReviewById)
  .put(AuthService.protect, updateReview)
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "User"),
    deleteReview,
  );

module.exports = router;
