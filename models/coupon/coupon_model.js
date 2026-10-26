const express = require("express");
const { default: mongoose } = require("mongoose");
const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    expire: {
      type: Date,
      required: [true, "expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon Discount value required"],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Coupon", couponSchema);
