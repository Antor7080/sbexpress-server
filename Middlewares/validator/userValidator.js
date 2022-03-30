// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/userModel");

// add user
const addUserValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError("Email already is use!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("number")
        .isLength({ min: 5 })
        .withMessage("Number is required")
        /*   .isMobilePhone("bn-BD", {
              strictMode: true,
          })
          .withMessage("Mobile number must be a valid Bangladeshi mobile number") */
        .custom(async (value) => {
            try {
                const user = await User.findOne({ number: value });
                if (user) {
                    throw createError("Mobile already is use!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
        ),
];

const addUserValidationHandler = function (req, res, next) {
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
    addUserValidators,
    addUserValidationHandler,
};
