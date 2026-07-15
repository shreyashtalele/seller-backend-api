const { body } = require("express-validator");

const createSellerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^[0-9]{10,15}$/)
        .withMessage("Mobile number must contain 10 to 15 digits"),

    body("country")
        .trim()
        .notEmpty()
        .withMessage("Country is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("skills")
        .isArray({ min: 1 })
        .withMessage("Skills must be a non-empty array"),

    body("skills.*")
        .trim()
        .notEmpty()
        .withMessage("Each skill must be a non-empty string"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character"),
];

const sellerLoginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string"),
];
module.exports = {
    createSellerValidator,
    sellerLoginValidator
};