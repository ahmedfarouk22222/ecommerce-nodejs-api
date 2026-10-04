const { check } = require("express-validator");
const { body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleWere = require("../../../middlewares/validator_middleware");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is require")
    .isLength({ min: 3 })
    .withMessage("Brand name is too short")
    .isLength({ max: 32 })
    .withMessage("Brand name is too long"),
  validatorMiddleWere,
];
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand Id"),
  validatorMiddleWere,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand Id"),
  body("name")
    .notEmpty()
    .withMessage("Brand name is require")
    .isLength({ min: 3 })
    .withMessage("Brand name is too short")
    .isLength({ max: 32 })
    .withMessage("Brand name is too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWere,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand Id"),
  validatorMiddleWere,
];
