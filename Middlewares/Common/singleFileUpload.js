// external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(
    subfolder_path,
    allowed_file_types,
    max_file_size,
    error_msg
) {

    // File upload folder
    const UPLOADS_FOLDER = '../../public/uploads/avatars/'; /* `${__dirname}/../public/uploads/${subfolder_path}/ ` */
  
    // define the storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER);
            console.log(file, storage, req);

        },

        filename: (req, file, cb) => {
            console.log(file);
            const fileExt = path.extname(file.originalname);
            console.log('file', fileExt);
            const fileName =
                file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                "-" +
                Date.now();

            cb(null, fileName + fileExt);

        },
    });


    // preapre the final multer upload object
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_file_size,
        },
        fileFilter: (req, file, cb) => {
            if (allowed_file_types.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(error_msg));
            }
        },
    });

    return upload;

}

module.exports = uploader;