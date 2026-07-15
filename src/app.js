const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("./routes/admin.route");
const sellerRoutes = require("./routes/seller.route");
const productRoutes = require("./routes/product.route");


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Seller Management API is running",
    });
});

app.use("/api/admin", adminRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
// Handle routes that do not exist
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error(error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error",
    });
});

module.exports = app;