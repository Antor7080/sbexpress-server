const router = require('express').Router();
const mobileBanking = require('../models/MobileBankingModal');
const auth = require('../Middlewares/auth');
const MobileBankingController = require('../controller/MobileBankingController');
const { mobileBankingValidator,
    mobileBankingValidatorHandle } = require('../Middlewares/validator//mobileBankingValidator');
router.post('/', auth, mobileBankingValidator, mobileBankingValidatorHandle, MobileBankingController.addMobileBanking)

module.exports = router