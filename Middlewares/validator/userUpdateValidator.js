// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
// const User = require("../../models/userModel");

// add user
const updateUserValidators = [
    check("number")
        .isLength({ min: 1 })
        .withMessage("Number is required"),
    check("name")
        .isLength({ min: 1 })
        .withMessage("name is required"),
    check("user_address")
        .isLength({ min: 1 })
        .withMessage("User Address is required"),
    check("r_address")
        .isLength({ min: 1 })
        .withMessage("Reference Address is required"),
    check("r_number")
        .isLength({ min: 1 })
        .withMessage("Reference Number is required"),
    check("r_name")
        .isLength({ min: 1 })
        .withMessage("Reference Name is required"),
    check("r_relation")
        .isLength({ min: 1 })
        .withMessage("Reference Relation is required"),
    check("shope_name")
        .isLength({ min: 1 })
        .withMessage("shope Name is required"),
    check("passport_no")
        .isLength({ min: 1 })
        .withMessage("Passport Number Relation is required"),
    check("shop_address")
        .isLength({ min: 1 })
        .withMessage("Shop Address is required"),

    check("bank_name")
        .isLength({ min: 1 })
        .withMessage("Bank Name is required"),
    check("account_name")
        .isLength({ min: 1 })
        .withMessage("Account Name is required"),
    check("account_number")
        .isLength({ min: 1 })
        .withMessage("Account Number is required"),
    check("bank_b_name")
        .isLength({ min: 1 })
        .withMessage("Brance is required"),
    check("switt_code")
        .isLength({ min: 1 })
        .withMessage("switt code is required"),
    check("bkash")
        .isLength({ min: 1 })
        .withMessage("bkash number is required"),
    check("nagad")
        .isLength({ min: 1 })
        .withMessage("nagad number is required"),
    check("rocket")
        .isLength({ min: 1 })
        .withMessage("rocket number is required"),
    check("rocket")
        .isLength({ min: 1 })
        .withMessage("rocket number is required"),


];

const updateUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        if (req.file && req.file.filename) {
            const filename = req.file.filename;
            console.log(req.file);
            unlink(
                path.join(path.dirname(__dirname), `../uploads/${filename}`),
                (err) => {
                    if (err) console.log(err);
                }
            );

        }

        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    updateUserValidators,
    updateUserValidationHandler,
};
