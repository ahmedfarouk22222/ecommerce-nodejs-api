const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validator_middleware");
const User = require("../../../models/user/user_model");
const becrypt = require("bcryptjs");

exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  check("role").optional(),

  validatorMiddleware,
];
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("invalid User Id"),
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordCorrect = await becrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new Error("inCoorect Current Password");
      }
    }),
  check("newPasswordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.changeLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required")
    .custom(async (val, { req }) => {
      // select("+password") لأن الـ password مخفي بـ select: false
      const user = await User.findById(req.user._id).select("+password");
      const isCorrect = await becrypt.compare(val, user.password);
      if (!isCorrect) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password"),

  check("newPasswordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),

  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  validatorMiddleware,
];
