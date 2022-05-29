// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/userModel");
const { isNumber } = require("util");

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
    check("username")
        .isLength({ min: 1 })
        .withMessage("Username is required")
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ username: value });
                if (user) {
                    throw createError("Username already in use!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("country")
        .isLength({ min: 1 })
        .withMessage("Country is required")
        .custom(async (value) => {
            console.log(value);
            try {

                if (value == "Select Country") {
                    throw createError("Please Select Country");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("number")
        .isLength({ min: 1 })
        .withMessage("Number is required")
        /*   .isMobilePhone("bn-BD", {
              strictMode: true,
          })
          .withMessage("Mobile number must be a valid Bangladeshi mobile number") */
        .custom(async (value) => {
            try {
                const user = await User.findOne({ number: value });
                if (user) {
                    throw createError("Mobile number already in use!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isLength({ min: 5 })
        .withMessage(
            "Pin must be at least 5 digit"
        )
        .isInt()
        .withMessage("Pin Must be Number"),
    check("password1")
        .isLength({ min: 1 })
        .withMessage("Confirm Pin required")
        .custom((password1, { req }) => {
            if (password1 !== req.body.password) {
                return Promise.reject("Pin  does not matched");
            }
            return true;
        }),
    check("user_address")
        .isLength({ min: 1 })
        .withMessage("User Address is required"),
    check("shope_name")
        .isLength({ min: 1 })
        .withMessage("shope Name is required"),

];

const addUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {

        if (req.file && req.file.filename) {
            const filename = req.file.filename;
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
            data: req.body

        });
    }
};

module.exports = {
    addUserValidators,
    addUserValidationHandler,
};
