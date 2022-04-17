const recharge = require('../models/rechargeModal');
const Users = require('../models/userModel');

const rechargeController = {
    addRecharge: async (req, res) => {
        const { amount, number, simOperator } = req.body;
        const _id = req.userId;
        const user = await Users.findById({ _id });
        const intAmount = parseInt(amount);
        if (user.amount < intAmount) {
            return res.status(400).json({
                errors: {
                    amount: {
                        msg: "You Dont Have Enough balance to recharge"
                    }
                }
            })
        };
        try {
            const data = await new recharge({
                user: req.userId,
                amount: intAmount,
                number,
                simOperator
            })
            const updateRecharge = await data.save();
            res.status(200).json({ msg: "Recharge Request Submitted Successfully", updateRecharge });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    getRecharge: async (req, res) => {

        try {
            const { page = 1, limit = 10, status, email } = req.query;
            const id = req.userId;
            if (status && !email) {
                const total = await recharge.find({ status: status })
                const recharge_request = await recharge.find({ status: status }).sort({ "updatedAt": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: recharge_request })
            };
            if (email && status) {
                const total = await recharge.find({ status: status, "user": id })
                const recharge_request = await recharge.find({ status: status, "user": id }).sort({ "updatedAt": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: recharge_request })
            };

            if (!status && !email) {
                const total = await recharge.find()
                const recharge_request = await recharge.find().sort({ "updatedAt": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit) //items.rechargeId
                res.status(200).json({ total: total.length, data: recharge_request })
            };
            if (!status && email) {
                const total = await recharge.find({ "user": id })
                const recharge_request = await recharge.find({ "user": id }).sort({ "updatedAt": -1 }).populate("user", "name email -_id shope_name number ").limit(limit * 1).skip((page - 1) * limit)
                res.status(200).json({ total: total.length, data: recharge_request })
            };
        } catch (error) {
            res.status(400).json(error)
        };

    },
    getSingleRechargeInfo: async (req, res) => {
        const rechargeId = req.params.id

        try {
            const recharge_request = await recharge.findById(rechargeId).populate("user", "name email -_id shope_name number "); //items.rechargeId
            res.status(200).json(recharge_request);
        } catch (error) {
            res.status(400).json(error)
        };
    },
    update: async (req, res) => {
        const rechargeId = req.params.id;
        const { status, note, amount, simOperator } = req.body
        const newBalacne = parseInt(amount);
        try {
            if (note && status) {
                const updaterecharge = await recharge.findOneAndUpdate({ _id: rechargeId }, {
                    $set: {
                        status,
                        note
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updaterecharge: updaterecharge });
            }
            else if (!note && status && !amount) {
                const updaterecharge = await recharge.findOneAndUpdate({ _id: rechargeId }, {
                    $set: {
                        status
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updaterecharge: updaterecharge });
            }
            else if (amount && status && simOperator) {
                const updaterecharge = await recharge.findOneAndUpdate({ _id: rechargeId }, {
                    $set: {
                        amount: newBalacne,
                        status,
                        simOperator
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updaterecharge: updaterecharge });
            }
        } catch (error) {
            res.status(400).json(error);

        }
    }

}

module.exports = rechargeController