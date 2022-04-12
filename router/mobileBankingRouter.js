const router = require('express').Router();
const mobileBanking = require('../models/MobileBankingModal');
const auth = require('../Middlewares/auth');
const MobileBankingController = require('../controller/MobileBankingController');
const { mobileBankingValidator,
    mobileBankingValidatorHandle } = require('../Middlewares/validator//mobileBankingValidator');
router.post('/', auth, mobileBankingValidator, mobileBankingValidatorHandle, MobileBankingController.addMobileBanking)
router.get("/", auth, MobileBankingController.getMobileBanking)
router.get("/:id", auth, MobileBankingController.getSingleMobileBankingInfo)
router.put("/:id", auth, MobileBankingController.update)

module.exports = router