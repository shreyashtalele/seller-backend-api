const adminService = require("../services/admin.service");

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await adminService.loginAdmin({
            email,
            password,
        });

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin,
};