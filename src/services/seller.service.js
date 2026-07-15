const bcrypt = require("bcryptjs");

const Seller = require("../models/Seller");
const { generateToken } = require("../utils/jwt");

const createSeller = async (sellerData) => {
    const {
        name,
        email,
        mobile,
        country,
        state,
        skills,
        password,
    } = sellerData;

    const normalizedEmail = email.trim().toLowerCase();

    const existingSeller = await Seller.findOne({
        email: normalizedEmail,
    });

    if (existingSeller) {
        const error = new Error("Seller with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const seller = await Seller.create({
        name: name.trim(),
        email: normalizedEmail,
        mobile: mobile.trim(),
        country: country.trim(),
        state: state.trim(),
        skills: skills.map((skill) => skill.trim()),
        password: hashedPassword,
        role: "seller",
    });

    return {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        mobile: seller.mobile,
        country: seller.country,
        state: seller.state,
        skills: seller.skills,
        role: seller.role,
        createdAt: seller.createdAt,
    };
};

const loginSeller = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const seller = await Seller.findOne({
        email: normalizedEmail,
    }).select("+password");

    if (!seller) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        seller.password
    );

    if (!isPasswordMatched) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateToken({
        id: seller._id,
        role: seller.role,
    });

    return {
        accessToken,
        role: seller.role,
        seller: {
            id: seller._id,
            name: seller.name,
            email: seller.email,
        },
    };
};
const getSellerProfile = async (sellerId) => {
    const seller = await Seller.findById(sellerId);

    if (!seller) {
        const error = new Error("Seller not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        mobile: seller.mobile,
        country: seller.country,
        state: seller.state,
        skills: seller.skills,
        role: seller.role,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt,
    };
};
module.exports = {
    createSeller,
    loginSeller,
    getSellerProfile,
};