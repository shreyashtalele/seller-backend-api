const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const { generateToken } = require("../utils/jwt");

const loginAdmin = async ({ email, password }) => {
    const admin = await Admin.findOne({
        email: email.toLowerCase(),
    }).select("+password");

    if (!admin) {
        throw new Error("Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        admin.password
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateToken({
        id: admin._id,
        role: admin.role,
    });

    return {
        accessToken,
        role: admin.role,
        admin: {
            id: admin._id,
            email: admin.email,
        },
    };
};

module.exports = {
    loginAdmin,
};