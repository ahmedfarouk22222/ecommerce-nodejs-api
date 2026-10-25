const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/user/user_model");
const ApiError = require("../../utils/api_error");

exports.addToWishList = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user.id,
        {
            $addToSet: { wishlist: req.body.productId },
        },
        { new: true });

    res.status(200).json({
        status: "success",
        message: "product added to wishlist successfully",
        data: user,
    });
});
exports.removeFromWishList = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user.id,
        {
            $pull: { wishlist: req.body.productId },
        },
        { new: true });

    res.status(200).json({
        status: "success",
        message: "product removed from wishlist successfully",
        data: user,
    });
});
exports.getWishList = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).populate("wishlist");
    res.status(200).json({
        status: "success",
        message: "wishlist retrieved successfully",
        data: user.wishlist,
    });
});