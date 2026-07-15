const express = require("express");

const {
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    viewProductPdf
} = require("../controllers/product.controller");

const {
    createProductValidator,
    updateProductValidator,
} = require("../validators/product.validator");

const {
    productListQueryValidator,
} = require("../validators/productQuery.validator");

const {
    uploadProductImages,
} = require("../middlewares/upload.middleware");

const parseProductForm = require(
    "../middlewares/parseProductForm.middleware"
);


const validateRequest = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");
const { sellerOnly } = require("../middlewares/role.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    sellerOnly,
    uploadProductImages.array("images", 10),
    parseProductForm,
    createProductValidator,
    validateRequest,
    createProduct
);
router.get(
    "/",
    authenticate,
    sellerOnly,
    getSellerProducts
);
router.get(
    "/:productId",
    authenticate,
    sellerOnly,
    getProductById
);
router.get(
    "/:productId/pdf",
    authenticate,
    sellerOnly,
    viewProductPdf
);
router.put(
    "/:productId",
    authenticate,
    sellerOnly,
    uploadProductImages.array("images", 10),
    parseProductForm,
    updateProductValidator,
    validateRequest,
    updateProduct
);
router.delete(
    "/:productId",
    authenticate,
    sellerOnly,
    deleteProduct
);

router.get(
    "/",
    authenticate,
    sellerOnly,
    productListQueryValidator,
    validateRequest,
    getSellerProducts
);
module.exports = router;