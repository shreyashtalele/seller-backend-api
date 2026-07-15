const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        mobile: {
            type: String,
            required: true,
            trim: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: ["seller"],
            default: "seller",
        },
    },
    {
        timestamps: true,
    }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller