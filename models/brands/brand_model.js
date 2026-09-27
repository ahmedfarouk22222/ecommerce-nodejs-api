const mongoose = require("mongoose");

const brandShema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand Name Must Be Required"],
            unique: [true, "Brand Name Must Be Required"],
            minlength: [3, 'Brand name must be at least 3 characters long'],
            maxlength: [32, 'Brand name must be at most 50 characters long'],

        },
        slug: { type: String, lowercase: true },
        image: String,
    },
    { timestamp: true }
);
module.exports = mongoose.model("Brand", brandShema);