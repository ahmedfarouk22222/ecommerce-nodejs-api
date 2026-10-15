const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/api_error");
const UserModel = require("../../models/user/user_model");
const becrypt = require("bcryptjs");

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

exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user || !(await becrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid Email or password"));
  }
  const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });
  res.status(200).json({ data: user, token });
});
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not login", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const currentUser = await UserModel.findById(decoded.UserId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }
  if (currentUser.changePasswordAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.changePasswordAt.getTime() / 1000,
      10,
    );
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User recently Changed Password,Please Login again"),
      );
    }
  }
  req.user = currentUser;
  next();
});
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is No User With this email:${req.body.email}`, 404),
    );
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();
});
