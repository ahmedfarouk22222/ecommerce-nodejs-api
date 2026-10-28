const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/api_error");
const CartModel = require("../../models/cart/cart_model");
const ProductModel = require("../../models/product/product_model");

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);
  let cart = await CartModel.findOne({ user: req.user.id });
  if (!cart) {
    cart = await CartModel.create({
      user: req.user.id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color,
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  let totalPrice = 0;
  cart.cartItems.forEach((ite) => {
    totalPrice = ite.quantity * ite.price;
  });
  cart.totalCartPrice += totalPrice;

  await cart.save();
  res.status(201).json({ status: "Success", data: cart });
});
