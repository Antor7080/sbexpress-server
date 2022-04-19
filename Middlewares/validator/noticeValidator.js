const { check, validationResult } = require("express-validator");

const noticeValidator = [
    check("notice")
        .isLength({ min: 1 })
        .withMessage("notice is required")
];
const noticeValidatorHandle = function (req, res, next) {
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
    noticeValidator,
    noticeValidatorHandle,
};

