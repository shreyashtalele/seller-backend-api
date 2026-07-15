const { query } = require("express-validator");

const productListQueryValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be at least 1")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
        .toInt(),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search cannot exceed 100 characters"),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "productName"])
        .withMessage(
            "sortBy must be createdAt, updatedAt, or productName"
        ),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be asc or desc"),
];

module.exports = {
    productListQueryValidator,
};