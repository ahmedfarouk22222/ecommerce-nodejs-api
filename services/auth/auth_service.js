const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/api_error");
const UserModel = require("../../models/user/user_model");
const becrypt = require("bcryptjs");
const sendEmail = require("../../utils/email/send_email");

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
  const message = `Hi ${user.name},\n\nYou requested a password reset. Please use the following code to reset your password:\n\n${resetCode}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nYour Company Name`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code",
      message: message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res.status(200).json({
    status: "success",
    message: "Reset code sent to email",
  });
});
exports.vertifyResetCode = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code is invalid or expired", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is No User With this email:${req.body.email}`, 404),
    );
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newpassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_DATE,
  });

  res.status(200).json({ status: "Success", token });
});
