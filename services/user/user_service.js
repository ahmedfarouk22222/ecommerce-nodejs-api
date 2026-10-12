const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/user/user_model");
const ApiError = require("../../utils/api_error");
const handelerFactory = require("../handlerer_factory");

exports.createUser = asyncHandler(async (req, res) => {
  const user = await UserModel.create(req.body);
  res.status(201).json({ data: user });
});
exports.getUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const User = await UserModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: User.length, data: User });
});
exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getUserById = await UserModel.findById(id);
  if (!getUserById) {
    return next(new ApiError(`User not found by this id: ${id}`, 404));
  }
  res.status(200).json({ data: getUserById });
});
exports.updateUser = handelerFactory.updateOne(UserModel);
exports.deleteUser = handelerFactory.deleteOne(UserModel);
