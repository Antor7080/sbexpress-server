const router = require('express').Router();
const noticeController = require('../controller/noticeCotroller')
const auth = require('../Middlewares/auth')
const { noticeValidator,
    noticeValidatorHandle, } = require('../Middlewares/validator/noticeValidator');


router.post('/', auth, noticeValidator, noticeValidatorHandle, noticeController.addNotice)
router.get("/", auth, noticeController.getNotice)

module.exports = router