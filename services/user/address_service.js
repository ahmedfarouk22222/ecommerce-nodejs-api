const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/user/user_model");

exports.addToAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    message: "address added to addresses successfully",
    data: user,
  });
});
exports.removeFromAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );

  res.status(200).json({
    status: "success",
    message: "address removed from addresses successfully",
    data: user,
  });
});
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  res.status(200).json({
    status: "success",
    message: "addresses retrieved successfully",
    data: user.addresses,
  });
});
