const router = require('express').Router()
const userCtrl = require('../controller/userCtr')
const avatarUpload = require('../Middlewares/Common/fileUpload')
router.post('/register', avatarUpload, userCtrl.register
)

const auth = require('../Middlewares/Common/auth')



router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)

// router.patch('/addcart', auth, userCtrl.addCart)

// router.get('/history', auth, userCtrl.history)


module.exports = router