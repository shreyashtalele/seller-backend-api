const express = require("express");

const {
    loginSeller,
    getSellerProfile,
} = require("../controllers/seller.controller");

const {
    sellerLoginValidator,
} = require("../validators/seller.validator");

const validateRequest = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");
const { sellerOnly } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
    "/login",
    sellerLoginValidator,
    validateRequest,
    loginSeller
);

router.get(
    "/profile",
    authenticate,
    sellerOnly,
    getSellerProfile
);

module.exports = router;