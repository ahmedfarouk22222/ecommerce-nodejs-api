const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: [true, 'Category name must be unique'],
            minlength: [3, 'Category name must be at least 3 characters long'],
            maxlength: [50, 'Category name must be at most 50 characters long'],
        },
        slug: { type: String, lowercase: true },
        image: String,
    },
    { timestamps: true }
);
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;