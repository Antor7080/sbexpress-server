const notice = require("../models/noticeModal");

const noticeController = {
    addNotice: async (req, res) => {
        try {
            const data = await new notice({
                ...req.body
            });
            const updateMobileBanking = await data.save();
            res.status(200).json({ msg: "Mobile Banking Request Submitted Successfully", updateMobileBanking });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    getNotice: async (req, res) => {
        const { page = 1, limit = 5, status } = req.query;
        try {
            const total = await notice
                .find({ status: status });
            const notices = await notice
                .find({ status: status })
                .sort({ "updatedAt": -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);
            res.status(200).json({ data: notices, total: total.length })
        } catch (error) {
            res.status(400).json(error)
        }
    }

}

module.exports = noticeController;