const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    title: { type: String },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Review must belong to a product"],
      },
    },
  },
  { timestamp: true },
);

module.exports = mongoose.model("Review", reviewSchema);
