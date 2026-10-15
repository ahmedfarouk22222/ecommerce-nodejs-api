const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validator_middleware");
const User = require("../../../models/user/user_model");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      }),
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  validatorMiddleware,
];
exports.vertifyResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("resetCode required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be exactly 6 characters"),
  validatorMiddleware,
];
exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("newpassword")
    .notEmpty()
    .withMessage("New password required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  check("newPasswordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newpassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
  validatorMiddleware,
];
