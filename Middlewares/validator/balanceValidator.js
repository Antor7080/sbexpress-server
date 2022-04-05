const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const balanceValidator = [
    check("amount")
        .isLength({ min: 1 })
        .withMessage("Amount is required")
        .trim(),
    check("payment_method")
        .custom(async (value) => {
            try {
                if (value === "Select the payment method") {
                    throw createError("Please Select the payment method!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        })
];
const balanceValidatorHandle = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // response the errors
        res.status(500).json({
            errors: mappedErrors,
            data: req.body
        });
    }
};

module.exports = {
    balanceValidator,
    balanceValidatorHandle,
};
