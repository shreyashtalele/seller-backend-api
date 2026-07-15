const { body } = require("express-validator");

const createProductValidator = [
    body("productName")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("productDescription")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("brands")
        .isArray({ min: 1 })
        .withMessage("At least one brand is required"),

    body("brands.*.brandName")
        .trim()
        .notEmpty()
        .withMessage("Brand name is required"),

    body("brands.*.detail")
        .trim()
        .notEmpty()
        .withMessage("Brand detail is required"),

    body("brands.*.price")
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 0"),
];


const updateProductValidator = [
    body("productName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be empty"),

    body("productDescription")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("brands")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one brand is required"),

    body("brands.*.brandName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Brand name is required"),

    body("brands.*.detail")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Brand detail is required"),

    body("brands.*.price")
        .optional()
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 0"),
];
module.exports = {
    createProductValidator,
    updateProductValidator,
};