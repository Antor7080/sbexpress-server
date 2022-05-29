const mobileBanking = require('../models/MobileBankingModal');
const Users = require('../models/userModel')
const MobileBankingController = {
    addMobileBanking: async (req, res) => {
        const { amount, number, Mobile_Banking_Operator, type } = req.body;
        const intAmount = parseInt(amount);
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
            const { page = 1, limit = 50, status, email } = req.query;
            const id = req.userId;
            if (status && !email) {
                const total = await mobileBanking.find({ status: status });
                const mobileBanking_request = await mobileBanking
                    .find({ status: status })
                    .sort({ "updatedAt": -1 })
                    .populate("user", "name email -_id shope_name number ")
                    .limit(limit * 1)
                    .skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
            if (email && status) {
                const total = await mobileBanking.find({ status: status, "user": id })
                const mobileBanking_request = await mobileBanking
                    .find({ status: status, "user": id })
                    .sort({ "updatedAt": -1 })
                    .populate("user", "name email -_id shope_name number ")
                    .limit(limit * 1)
                    .skip((page - 1) * limit);
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };

            if (!status && !email) {
                const total = await mobileBanking.find()
                const mobileBanking_request = await mobileBanking
                    .find()
                    .sort({ "updatedAt": -1 })
                    .populate("user", "name email -_id shope_name number ")
                    .limit(limit * 1)
                    .skip((page - 1) * limit) //items.mobileBankingId
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
            if (!status && email) {
                const total = await mobileBanking.find({ "user": id })
                const mobileBanking_request = await mobileBanking
                    .find({ "user": id })
                    .sort({ "updatedAt": -1 })
                    .populate("user", "name email -_id shope_name number ")
                    .limit(limit * 1).skip((page - 1) * limit)
                res.status(200).json({ total: total.length, data: mobileBanking_request })
            };
        } catch (error) {
            res.status(400).json(error)
        };

    },
    getSingleMobileBankingInfo: async (req, res) => {
        const mobileBankingId = req.params.id

        try {
            const mobileBanking_request = await mobileBanking
                .findById(mobileBankingId)
                .populate("user", "name email -_id shope_name number "); //items.mobileBankingId
            res.status(200).json(mobileBanking_request);
        } catch (error) {
            res.status(400).json(error)
        };
    },

    update: async (req, res) => {
        const mobileBankingId = req.params.id;

        const { status, note, amount, Mobile_Banking_Operator, type } = req.body
        const newBalacne = parseInt(amount);
        try {
            if (amount && type && Mobile_Banking_Operator) {
                const updatemobileBanking = await mobileBanking.findOneAndUpdate({ _id: mobileBankingId }, {
                    $set: {
                        ...req.body
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updatemobileBanking: updatemobileBanking });
            }
            else if (note && status) {

                const updatemobileBanking = await mobileBanking.findOneAndUpdate({ _id: mobileBankingId }, {
                    $set: {
                        status,
                        note
                    }
                }, { new: true });
                console.log(updatemobileBanking);
                res.status(200).json({ msg: "Updated Successfully", updatemobileBanking: updatemobileBanking });
            }
            else if (!note && status && !amount) {

                const updatemobileBanking = await mobileBanking.findOneAndUpdate({ _id: mobileBankingId }, {
                    $set: {
                        status
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updatemobileBanking: updatemobileBanking });
            }
            else if (amount && status && Mobile_Banking_Operator) {

                const updatemobileBanking = await mobileBanking.findOneAndUpdate({ _id: mobileBankingId }, {
                    $set: {
                        amount: newBalacne,
                        status,
                        Mobile_Banking_Operator
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updatemobileBanking: updatemobileBanking });
            }
        } catch (error) {
            res.status(400).json(error);

        }
    }

};
module.exports = MobileBankingController;