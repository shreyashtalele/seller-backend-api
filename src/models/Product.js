const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        trim: true,
    },
    detail: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
});

const productSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },

        productName: {
            type: String,
            required: true,
            trim: true,
        },

        productDescription: {
            type: String,
            required: true,
            trim: true,
        },

        brands: {
            type: [brandSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "At least one brand is required.",
            },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product