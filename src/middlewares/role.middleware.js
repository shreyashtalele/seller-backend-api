const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
    }

    next();
};

const sellerOnly = (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Seller only.",
        });
    }

    next();
};

module.exports = {
    adminOnly,
    sellerOnly,
};