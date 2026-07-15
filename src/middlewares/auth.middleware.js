const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const decoded = verifyToken(token);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token has expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        next(error);
    }
};

module.exports = authenticate;