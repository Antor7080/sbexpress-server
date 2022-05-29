const router = require('express').Router();
const userCtrl = require('../controller/userCtr')

const { upload } = require('../Middlewares/singleFileUpload')
const { addUserValidators,
    addUserValidationHandler, } = require('../Middlewares/validator/userValidator');
const { updateUserValidators,
    updateUserValidationHandler, } = require('../Middlewares/validator/userUpdateValidator')
router.post('/register', upload.single('avatar'), addUserValidators, addUserValidationHandler, userCtrl.register)

const auth = require('../Middlewares/auth')
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.post('/refreshToken', userCtrl.refreshToken);
router.get('/information/:id', userCtrl.getUser)
router.get('/all-information', userCtrl.allUser)
router.put('/update/:id', auth, userCtrl.statusUpdate)
router.put('/edit/:id', auth, upload.single('avatar'), updateUserValidators, updateUserValidationHandler, userCtrl.editUser)
module.exports = router