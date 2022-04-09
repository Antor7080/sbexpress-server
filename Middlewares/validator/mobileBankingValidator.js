const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const mobileBankingValidator = [
    check("amount")
        .isLength({ min: 1 })
        .withMessage("Amount is required")
        .trim(),
    check("number")
        .isLength({ min: 1 })
        .withMessage("Number is required")
        .trim(),
    check("Mobile_Banking_Operator")
        .custom(async (value) => {
            try {
                if (value === "Select Mobile Banking Operator") {
                    throw createError("Please Select Mobile Banking Operator!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("type")
        .custom(async (value) => {
            try {
                if (value === "Select Type") {
                    throw createError("Please Select Type!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        })
];
const mobileBankingValidatorHandle = function (req, res, next) {
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
    mobileBankingValidator,
    mobileBankingValidatorHandle,
};
