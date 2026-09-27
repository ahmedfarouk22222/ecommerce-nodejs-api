const { check, } = require('express-validator');
const validatorMiddleWere = require('../../../middlewares/validator_middleware');

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand name is require')
        .isLength({ min: 3 }).withMessage('Brand name is too short')
        .isLength({ max: 32 }).withMessage('Brand name is too long'),
    validatorMiddleWere,
];
exports.getBrandValidator = [check('id').isMongoId().withMessage('invalid Brand Id'),
    validatorMiddleWere,
];
exports.updateBrandValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
check('name').notEmpty().withMessage('Category name is require')
    .isLength({ min: 3 }).withMessage('Category name is too short')
    .isLength({ max: 32 }).withMessage('Category name is too long'),
    validatorMiddleWere,
];

exports.deleteBrandValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
    validatorMiddleWere,
];