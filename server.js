require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = Number(process.env.PORT) || 7000;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, HOST, () => {
            console.log(
                `Server running at http://${HOST}:${PORT}`
            );
        });

        server.on("error", (error) => {
            console.error("HTTP Server Error:", error.message);
            process.exit(1);
        });
    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );
        process.exit(1);
    }
};

startServer();