const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/api_error");
const UserModel = require("../../models/user/user_model");

exports.signUp = asyncHandler(async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });
  res.status(201).json({ data: user, token });
});
