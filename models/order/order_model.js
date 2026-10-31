const mongoose = require("mongoose");
const { applyTimestamps } = require("../cart/cart_model");
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Order Must be Belong To User"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    totalPrice: Number,
    taxPrice: Number,
    shippngPrice: Number,
    shippngAddresee: {
      details: String,
      phone: String,
      city: String,
    },
    paymentType: { type: String, enum: ["cash", "Card"], default: "cash" },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDeliverd: { type: Boolean, default: false },
    DeliverddAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
