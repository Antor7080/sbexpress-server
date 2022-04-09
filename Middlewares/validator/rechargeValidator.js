const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const Users = require('../../models/userModel')

const rechargeValidator = [
    check("amount")
        .isLength({ min: 1 })
        .withMessage("Amount is required")
        .trim()
        .custom(async (value, req) => {
            const userId = req.req.userId
            const user = await Users.findOne({ _id: userId })

            try {
                if (user.amount < parseInt(value)) {
                    throw createError("You dont have sufficient balance to recharge!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        })
    ,
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

