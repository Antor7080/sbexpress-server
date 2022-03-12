const uploader = require("./singleFileUpload");

function avatarUpload(req, res, next) {
    console.log(req.files);
    console.log(req.body);
    const upload = uploader(
        "avatars",
        ["image/jpeg", "image/jpg", "image/png"],
        1000000,
        "Only .jpg, jpeg or .png format allowed!"
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            },
                console.log(err));
        } else {
            next();
        }
    });
}

module.exports = avatarUpload;