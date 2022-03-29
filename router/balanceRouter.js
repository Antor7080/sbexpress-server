const router = require('express').Router();
const balance = require('../models/balanceModel');
const auth = require('../Middlewares/auth')

router.post('/add-balance', auth, async (req, res) => {
    const { amount, payment_method } = req.body;
    const newAmount = parseInt(amount);
    if (!newAmount) {
        return res.status(400).json({ msg: "Amount is Required " })
    }
    if (newAmount < 999) {
        return res.status(400).json({ msg: "Amount Minimum " + 1000 })
    };
    if (payment_method === "Select the payment method") {
        return res.status(400).json({ msg: "Select the payment method" })
    }
    try {
        const data = await new balance({
            user: req.userId,
            amount: newAmount,
            payment_method
        })
        const updateBalance = await data.save();
        res.status(200).json(updateBalance);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.get('/all-balance-request', auth, async (req, res) => { // 

    try {
        const { page = 1, limit = 10, status, email } = req.query;
        const id = req.userId
        if (status && !email) {
            const total = await balance.find({ status: status })
            console.log("total", total);
            const balance_request = await balance.find({ status: status }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit)
            res.status(200).json({ total: total.length, data: balance_request })
        };
        if (email && status) {
            const total = await balance.find({ status: status, "user": id })
            const balance_request = await balance.find({ status: status, "user": id }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit)
            res.status(200).json({ total: total.length, data: balance_request })
        };

        if (!status && !email) {
            const total = await balance.find()
            const balance_request = await balance.find().populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit) //items.BalanceId
            res.status(200).json({ total: total.length, data: balance_request })
        }
        if (!status && email) {
            const total = await balance.find({ "user": id })
            const balance_request = await balance.find({ "user": id }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit)
            res.status(200).json({ total: total.length, data: balance_request })
        }
    } catch (error) {
        res.status(400).json(error)
    }
});

//single item get

router.get('/all-balance-request/:id', auth, async (req, res) => { // 
    const BalanceId = req.params.id

    try {
        const balance_request = await balance.findOne({ _id: BalanceId }).populate("user", "name email -_id shope_name number ") //items.BalanceId
        res.status(200).json(balance_request)
    } catch (error) {
        res.status(400).json(error)
    }
});

router.put("/update/:id", auth, async (req, res) => {

    const BalanceId = req.params.id
    const { status, note, amount } = req.body
    console.log(req.body);
    const newBalacne = parseInt(amount)
    try {

        if (note && status) {
            const updateBalance = await balance.findOneAndUpdate({ _id: BalanceId }, {
                $set: {
                    status,
                    note
                }
            }, { new: true });
            res.status(200).json({ msg: "Updated Successfully", updateBalance: updateBalance });
        }
        else if (!note && status && !amount) {
            const updateBalance = await balance.findOneAndUpdate({ _id: BalanceId }, {
                $set: {
                    status
                }
            }, { new: true });
            res.status(200).json({ msg: "Updated Successfully", updateBalance: updateBalance });
        }
        else if (amount && status) {
            const updateBalance = await balance.findOneAndUpdate({ _id: BalanceId }, {
                $set: {
                    amount: newBalacne,
                    status
                }
            }, { new: true });
            console.log(updateBalance);
            res.status(200).json({ msg: "Updated Successfully", updateBalance: updateBalance });
        }


    } catch (error) {

        res.status(400).json(error);
    }


});


module.exports = router