const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'subCategory Must Be Unique'],
            minlength: [2, 'to Short SubCategory Name'],
            maxlength: [32, 'to Long SubCategory Name'],

        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, 'SubCategory must be belong to parent category'],
        },
    }, {
    timestamps: true
});
const subCategoryModel = mongoose.model('SubCategory', subCategorySchema);
module.exports = subCategoryModel;