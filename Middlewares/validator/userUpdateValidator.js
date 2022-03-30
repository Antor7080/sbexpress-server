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
        .withMessage("Number is required")


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
