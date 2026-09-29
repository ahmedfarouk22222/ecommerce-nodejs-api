const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Product Name Must Be Required'],
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [32, 'Product name must be at most 50 characters long'],
        trim: true,
    },
    slug: { type: String, lowercase: true },
    description: {
        type: String,
        require: [true, 'Product Description Must Be Required'],
        minlength: [20, 'Product Description must be at least 3 characters long'],
        maxlength: [32, 'Product Description must be at most 50 characters long'],
    },
    quantity: {
        type: Number,
        require: [true, "Product quantity Must Be Require"]
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        require: [true, 'Product Price Must Be Require'],
        max: [200000, 'To Long Product Price'],
    },
    priceAfterDiscount: {
        type: Number,
    },
    imageCover: {
        type: String,
        require: [true, "Product Image Cover Is Require"],
    },
    images: [String],
    colors: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        require: [true, 'Product must be belong to parent category']
    },
    subcategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',

    },
    ],

    brand: {

        type: mongoose.Schema.ObjectId,
        ref: "Brand",

    },
    ratingAverage: {
        type: Number,
        min: [1, 'Rating Must be above pr equal 1.0'],
        max: [5, 'Rating Must be below pr equal 5.0']
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },

},
    { timestamps: true }
);

module.exports = mongoose.model("Product", productShema);