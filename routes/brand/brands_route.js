const express = require("express");
const { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } = require('../../services/brands/brand_service');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../../utils/validators/brand/brand_validator");

const router = express.Router();

router.route('/').post(createBrandValidator, createBrand).get(getBrands);
router.route('/:id').get(getBrandValidator, getBrandById).put(updateBrandValidator, updateBrand).delete(deleteBrandValidator, deleteBrand);

module.exports = router;