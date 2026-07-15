const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");

const generateProductPdf = async ({
    productId,
    sellerId,
    res,
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

    const safeProductName = product.productName
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-");

    res.setHeader("Content-Type", "application/pdf");

    // Use "inline" for View PDF in the browser.
    res.setHeader(
        "Content-Disposition",
        `inline; filename="${safeProductName}-report.pdf"`
    );

    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
    });

    doc.pipe(res);

    // PDF title
    doc
        .fontSize(22)
        .text("Product Report", {
            align: "center",
        });

    doc.moveDown(1.5);

    // Product details
    doc
        .fontSize(16)
        .text("Product Name", {
            underline: true,
        });

    doc
        .fontSize(12)
        .text(product.productName);

    doc.moveDown();

    doc
        .fontSize(16)
        .text("Product Description", {
            underline: true,
        });

    doc
        .fontSize(12)
        .text(product.productDescription);

    doc.moveDown(1.5);

    doc
        .fontSize(18)
        .text("Brand Details", {
            underline: true,
        });

    doc.moveDown();

    let totalPrice = 0;

    product.brands.forEach((brand, index) => {
        totalPrice += Number(brand.price);

        // Add a new page if there is insufficient space.
        if (doc.y > 620) {
            doc.addPage();
        }

        doc
            .fontSize(15)
            .text(`Brand ${index + 1}`);

        doc.moveDown(0.5);

        const brandStartY = doc.y;

        // Brand image
        if (brand.image) {
            const imagePath = path.join(
                process.cwd(),
                "src",
                brand.image.replace(/^\/+/, "")
            );

            if (fs.existsSync(imagePath)) {
                try {
                    doc.image(imagePath, 50, brandStartY, {
                        fit: [130, 100],
                        align: "center",
                        valign: "center",
                    });
                } catch (error) {
                    doc
                        .fontSize(10)
                        .text(
                            "Brand image could not be displayed.",
                            50,
                            brandStartY
                        );
                }
            } else {
                doc
                    .fontSize(10)
                    .text(
                        "Brand image not found.",
                        50,
                        brandStartY
                    );
            }
        }

        // Brand information
        doc
            .fontSize(12)
            .text(
                `Brand Name: ${brand.brandName}`,
                210,
                brandStartY
            );

        doc
            .fontSize(12)
            .text(
                `Brand Price: Rs. ${Number(
                    brand.price
                ).toLocaleString("en-IN")}`,
                210,
                brandStartY + 25
            );

        if (brand.detail) {
            doc
                .fontSize(12)
                .text(
                    `Details: ${brand.detail}`,
                    210,
                    brandStartY + 50,
                    {
                        width: 330,
                    }
                );
        }

        doc.y = Math.max(
            doc.y,
            brandStartY + 120
        );

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .stroke();

        doc.moveDown();
    });

    // Total price
    if (doc.y > 700) {
        doc.addPage();
    }

    doc.moveDown();

    doc
        .fontSize(16)
        .text(
            `Total Price: Rs. ${totalPrice.toLocaleString(
                "en-IN"
            )}`,
            {
                align: "right",
            }
        );

    doc.end();
};

module.exports = {
    generateProductPdf,
};