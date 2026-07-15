const express = require("express");

const { loginAdmin } = require("../controllers/admin.controller");
const { createSeller } = require("../controllers/seller.controller");

const {
    adminLoginValidator,
} = require("../validators/admin.validator");

const {
    createSellerValidator,
} = require("../validators/seller.validator");

const validateRequest = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");

const { adminOnly } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
    "/login",
    adminLoginValidator,
    validateRequest,
    loginAdmin
);

router.get(
    "/profile",
    authenticate,
    adminOnly,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Admin route accessed successfully",
            data: req.user,
        });
    }
);

router.post(
    "/sellers",
    authenticate,
    adminOnly,
    createSellerValidator,
    validateRequest,
    createSeller
);

module.exports = router;