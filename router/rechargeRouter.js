const router = require('express').Router();
const recharge = require('../models/rechargeModal');
const auth = require('../Middlewares/auth');
const rechargeController = require('../controller/rechargeController')
const {
    rechargeValidator,
    rechargeValidatorHandle,
} = require('../Middlewares/validator/rechargeValidator');

router.post('/add-reacharge', auth, rechargeValidator, rechargeValidatorHandle, rechargeController.addRecharge);
router.get('/recharges', auth, rechargeController.getRecharge)
router.get('/recharges/:id', auth, rechargeController.getSingleRechargeInfo)
router.put('/update/:id', auth, rechargeController.update)




module.exports = router