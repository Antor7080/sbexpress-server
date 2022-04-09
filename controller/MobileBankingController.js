const mobileBanking = require('../models/MobileBankingModal');
const Users = require('../models/userModel')
const MobileBankingController = {
    addMobileBanking: async (req, res) => {
        const { amount, number, Mobile_Banking_Operator, type } = req.body;
        const _id = req.userId;
        const user = await Users.findById({ _id });
        const intAmount = parseInt(amount);
        if (user.amount < intAmount) {
            return res.status(400).json({
                errors: {
                    amount: {
                        msg: "You Dont Have enough balance to mobileBanking"
                    }
                }
            })
        };
        try {
            const data = await new mobileBanking({
                user: req.userId,
                amount: intAmount,
                number,
                type,
                Mobile_Banking_Operator
            });
            const updateMobileBanking = await data.save();
            res.status(200).json({ msg: "Mobile Banking Request Submitted Successfully", updateMobileBanking });
        } catch (error) {
            res.status(400).json(error);
        }
    },

    getMobileBanking: async (req, res) => {

        try {
            const { page = 1, limit = 10, status, email } = req.query;
            const id = req.userId;
            if (status && !email) {
                const total = await mobileBanking.find({ status: status })
                const mobileBanking_request = await mobileBanking.find({ status: status }).sort({ "invoice": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
            if (email && status) {
                const total = await mobileBanking.find({ status: status, "user": id })
                const mobileBanking_request = await mobileBanking.find({ status: status, "user": id }).sort({ "invoice": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };

            if (!status && !email) {
                const total = await mobileBanking.find()
                const mobileBanking_request = await mobileBanking.find().sort({ "invoice": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit) //items.mobileBankingId
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
            if (!status && email) {
                const total = await mobileBanking.find({ "user": id })
                const mobileBanking_request = await mobileBanking.find({ "user": id }).sort({ "invoice": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit)
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
        } catch (error) {
            res.status(400).json(error)
        };

    },

};
module.exports = MobileBankingController;