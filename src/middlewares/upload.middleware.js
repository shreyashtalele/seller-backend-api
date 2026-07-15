const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "products"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}`;

        const extension = path.extname(file.originalname).toLowerCase();

        callback(null, `${uniqueName}${extension}`);
    },
});

const imageFileFilter = (req, file, callback) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        const error = new Error(
            "Only JPEG, JPG, PNG, and WEBP images are allowed"
        );

        error.statusCode = 400;

        return callback(error, false);
    }

    callback(null, true);
};

const uploadProductImages = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
});

module.exports = {
    uploadProductImages,
};