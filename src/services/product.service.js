const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const createProduct = async ({
    sellerId,
    productName,
    productDescription,
    brands,
    files = [],
}) => {
    if (files.length !== brands.length) {
        const error = new Error(
            "Each brand must have exactly one image"
        );
        error.statusCode = 400;
        throw error;
    }

    const formattedBrands = brands.map((brand, index) => ({
        brandName: brand.brandName.trim(),
        detail: brand.detail.trim(),
        image: `/uploads/products/${files[index].filename}`,
        price: Number(brand.price),
    }));

    const product = await Product.create({
        seller: sellerId,
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        brands: formattedBrands,
    });

    return {
        id: product._id,
        seller: product.seller,
        productName: product.productName,
        productDescription: product.productDescription,
        brands: product.brands,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};
const getSellerProducts = async ({
    sellerId,
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
}) => {
    const skip = (page - 1) * limit;

    const filter = {
        seller: sellerId,
    };

    if (search) {
        filter.$or = [
            {
                productName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                productDescription: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                "brands.brandName": {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const [products, totalRecords] = await Promise.all([
        Product.find(filter)
            .sort({
                [sortBy]: sortOrder,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
        products: products.map((product) => ({
            id: product._id,
            seller: product.seller,
            productName: product.productName,
            productDescription: product.productDescription,
            brands: product.brands,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })),
        pagination: {
            page,
            limit,
            totalRecords,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};
const getProductById = async ({ productId, sellerId }) => {
    const product = await Product.findOne({
        _id: productId,
        seller: sellerId,
    }).lean();

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        id: product._id,
        seller: product.seller,
        productName: product.productName,
        productDescription: product.productDescription,
        brands: product.brands,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};
const updateProduct = async ({
    productId,
    sellerId,
    updateData,
    files = [],
    imageBrandIds = [],
}) => {
    const product = await Product.findOne({
        _id: productId,
        seller: sellerId,
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }


    if (files.length !== imageBrandIds.length) {
        const error = new Error(
            "Each uploaded image must have a corresponding brand ID"
        );
        error.statusCode = 400;
        throw error;
    }

    const existingBrandIds = product.brands.map((brand) =>
        brand._id.toString()
    );


    const invalidBrandId = imageBrandIds.find(
        (brandId) => !existingBrandIds.includes(brandId.toString())
    );

    if (invalidBrandId) {
        const error = new Error(
            `Invalid brand ID provided: ${invalidBrandId}`
        );
        error.statusCode = 400;
        throw error;
    }


    const uniqueImageBrandIds = new Set(
        imageBrandIds.map((brandId) => brandId.toString())
    );

    if (uniqueImageBrandIds.size !== imageBrandIds.length) {
        const error = new Error(
            "Duplicate brand IDs are not allowed in imageBrandIds"
        );
        error.statusCode = 400;
        throw error;
    }

    if (updateData.productName !== undefined) {
        product.productName = updateData.productName.trim();
    }

    if (updateData.productDescription !== undefined) {
        product.productDescription =
            updateData.productDescription.trim();
    }

    const oldImagesToDelete = [];

    if (updateData.brands !== undefined) {
        const uploadedImageMap = {};

        files.forEach((file, index) => {
            const brandId = imageBrandIds[index].toString();

            uploadedImageMap[brandId] =
                `/uploads/products/${file.filename}`;
        });

        product.brands = updateData.brands.map((brand, index) => {
            let existingBrand;


            if (brand._id) {
                existingBrand = product.brands.find(
                    (productBrand) =>
                        productBrand._id.toString() ===
                        brand._id.toString()
                );

                if (!existingBrand) {
                    const error = new Error(
                        `Invalid brand ID provided: ${brand._id}`
                    );
                    error.statusCode = 400;
                    throw error;
                }
            } else {

                existingBrand = product.brands[index];
            }

            let imagePath = existingBrand?.image;
            const existingBrandId =
                existingBrand?._id.toString();

            if (
                existingBrandId &&
                uploadedImageMap[existingBrandId]
            ) {
                if (existingBrand.image) {
                    const oldImagePath = path.join(
                        process.cwd(),
                        "src",
                        existingBrand.image.replace(/^\/+/, "")
                    );

                    oldImagesToDelete.push(oldImagePath);
                }

                imagePath =
                    uploadedImageMap[existingBrandId];
            } else if (brand.image) {
                imagePath = brand.image;
            }

            if (!imagePath) {
                const error = new Error(
                    `Image is required for brand at position ${index + 1}`
                );
                error.statusCode = 400;
                throw error;
            }

            return {
                _id: existingBrand?._id,
                brandName: brand.brandName.trim(),
                detail: brand.detail.trim(),
                image: imagePath,
                price: Number(brand.price),
            };
        });
    }

    await product.save();


    oldImagesToDelete.forEach((oldImagePath) => {
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    });

    return {
        id: product._id,
        seller: product.seller,
        productName: product.productName,
        productDescription: product.productDescription,
        brands: product.brands,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};
const deleteProduct = async ({ productId, sellerId }) => {
    const product = await Product.findOne({
        _id: productId,
        seller: sellerId,
    });

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    product.brands.forEach((brand) => {
        if (!brand.image) {
            return;
        }

        const imagePath = path.join(
            process.cwd(),
            "src",
            brand.image.replace(/^\/+/, "")
        );

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    });

    await product.deleteOne();

    return {
        id: product._id,
    };
};
module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};