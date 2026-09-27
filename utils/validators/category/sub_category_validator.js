const { check, } = require('express-validator');
const validatorMiddleWere = require('../../../middlewares/validator_middleware');

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('Category name is require')
        .isLength({ min: 2 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    check('category').notEmpty().withMessage('SubCategory must be belong to parent category').isMongoId()
        .withMessage('Invalid Category ID'),
    validatorMiddleWere,
];
exports.getSubCategoryValidator = [check('id').isMongoId().withMessage('invalid SubCategory Id'),
    validatorMiddleWere,
];
exports.updateSubCategoryValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
check('name').notEmpty().withMessage('Category name is require')
    .isLength({ min: 2 }).withMessage('Category name is too short')
    .isLength({ max: 32 }).withMessage('Category name is too long'),
check('category').notEmpty().withMessage('SubCategory must be belong to parent category').isMongoId()
    .withMessage('Invalid Category ID'),
    validatorMiddleWere,
];
exports.deleteSubCategoryValidator = [check('id').isMongoId().withMessage('invalid Category Id'),
    validatorMiddleWere,
];