const productService = require("../services/product.service");
const productPdfService = require("../services/productPdf.service");

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct({
            sellerId: req.user.id,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            brands: req.body.brands,
            files: req.files || [],
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getSellerProducts = async (req, res, next) => {
    try {
        const result = await productService.getSellerProducts({
            sellerId: req.user.id,
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            search: req.query.search || "",
            sortBy: req.query.sortBy || "createdAt",
            order: req.query.order || "desc",
        });

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById({
            productId: req.params.productId,
            sellerId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct({
            productId: req.params.productId,
            sellerId: req.user.id,
            updateData: req.body,
            files: req.files || [],
            imageBrandIds: req.body.imageBrandIds || [],
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        next(error);
    }
};
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productService.deleteProduct({
            productId: req.params.productId,
            sellerId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: {
                product: deletedProduct,
            },
        });
    } catch (error) {
        next(error);
    }
};

const viewProductPdf = async (req, res, next) => {
    try {
        await productPdfService.generateProductPdf({
            productId: req.params.productId,
            sellerId: req.user.id,
            res,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    viewProductPdf
};