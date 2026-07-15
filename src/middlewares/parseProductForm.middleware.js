const parseProductForm = (req, res, next) => {
    try {
        if (typeof req.body.brands === "string") {
            req.body.brands = JSON.parse(req.body.brands);
        }

        if (typeof req.body.imageBrandIds === "string") {
            req.body.imageBrandIds = JSON.parse(
                req.body.imageBrandIds
            );
        }

        next();
    } catch (error) {
        error.statusCode = 400;
        error.message =
            "Brands and imageBrandIds must contain valid JSON";
        next(error);
    }
};

module.exports = parseProductForm;