const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const rechargeValidator = [
    check("amount")
        .isLength({ min: 1 })
        .withMessage("Amount is required")
        .trim(),

    check("number")
        .isLength({ min: 1 })
        .withMessage("Mobile number must be a valid mobile number"),
    check("simOperator")
        .custom(async (value) => {
            try {
                if (value === "Select Sim Operator") {
                    throw createError("Please Select Sim Operator!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        })

];
const rechargeValidatorHandle = function (req, res, next) {
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
    rechargeValidator,
    rechargeValidatorHandle,
};
