const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const ProductModel = require('../../models/product/product_model');
const ApiError = require('../../utils/api_error');


exports.getProducts = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const products = await ProductModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: products.length, data: products });


});
exports.getProductById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const getProduct = await ProductModel.findById(id);
    if (!getProduct) {
        return next(new ApiError(`Product not found by this id: ${id}`, 404));
    }
    res.status(200).json({ data: getProduct });

});
exports.updateProducts = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.name);
    const updateProduct = await ProductModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true });
    if (!updateProduct) {
        return next(new ApiError(`Product not found by this id: ${id}`, 404));
    }
    res.status(200).json({ data: updateProduct });

});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deleteProduct = await ProductModel.findByIdAndDelete(id);

    if (!deleteProduct) {
        return next(new ApiError(`Product not found by this id: ${id}`, 404));
    }
    res.status(204).send();
});

exports.createCategory = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.name);
    const product = await ProductModel.create(req.body,)
    res.status(201).json({ data: product });
});
