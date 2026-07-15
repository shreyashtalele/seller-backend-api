const sellerService = require("../services/seller.service");

const createSeller = async (req, res, next) => {
    try {
        const seller = await sellerService.createSeller(req.body);

        return res.status(201).json({
            success: true,
            message: "Seller created successfully",
            data: {
                seller,
            },
        });
    } catch (error) {
        next(error);
    }
};

const loginSeller = async (req, res, next) => {
    try {
        const loginData = await sellerService.loginSeller({
            email: req.body.email,
            password: req.body.password,
        });

        return res.status(200).json({
            success: true,
            message: "Seller logged in successfully",
            data: loginData,
        });
    } catch (error) {
        next(error);
    }
};

const getSellerProfile = async (req, res, next) => {
    try {
        const seller = await sellerService.getSellerProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Seller profile fetched successfully",
            data: {
                seller,
            },
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createSeller,
    loginSeller,
    getSellerProfile
};