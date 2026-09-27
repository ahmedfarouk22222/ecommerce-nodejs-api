const { check, } = require('express-validator');
const validatorMiddleWere = require('../../../middlewares/validator_middleware');

exports.getCategoryValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
    validatorMiddleWere,
];
exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category name is require')
        .isLength({ min: 3 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    validatorMiddleWere,
];
exports.updateCategoryValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
check('name').notEmpty().withMessage('Category name is require')
    .isLength({ min: 3 }).withMessage('Category name is too short')
    .isLength({ max: 32 }).withMessage('Category name is too long'),
    validatorMiddleWere,
];

exports.deleteCategoryValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
    validatorMiddleWere,
];