const Users = require('../models/userModel')
const balance = require('../models/balanceModel')
const recharge = require('../models/rechargeModal')
const mobileBanking = require('../models/MobileBankingModal')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { unlink } = require("fs");
const path = require("path");
let refreshTokens = [];
const userCtrl = {

    register: async (req, res) => {
        try {
            const { email, password, username } = req.body;
            // Password Encryption
            const email1 = email.toLowerCase();
            const username1 = username.toLowerCase();
            const passwordHash = await bcrypt.hash(password, 10)
            let newUser;
            if (req.file && req.file.filename) {
                newUser = new Users({
                    ...req.body,
                    avatar: req.file.filename,
                    password: passwordHash,
                    email: email1,
                    username: username1
                });
            } else {
                newUser = new Users({
                    ...req.body,
                    password: passwordHash,
                    email: email1,
                    username: username1
                });
            }
            // Save mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ accesstoken })

        } catch (err) {
            return res.status(400).json({ msg: err.message })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ "username": email }) || await Users.findOne({ email });
            console.log(user);
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })
            if (user.role === 0 && user.status !== "Approved") {
                return res.status(400).json({ msg: "You can not login right now" })
            }
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });
            refreshTokens.push(refreshtoken);
            const userData = { email: user.email, name: user.name, number: user.number, id: user.id, role: user.role, _id: user._id, avatar: user.avatar }

            res.json({ accesstoken, refreshtoken, userData, msg: "Login Successfull!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        const refreshToken = req.header("Authorization")
        try {
            // res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            return res.json({ msg: "Logged out" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        const rf_token = req.body.token;
        if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })
        if (!refreshTokens.includes(rf_token)) {
            res.status(403).json({
                errors: [
                    {
                        msg: "Invalid refresh token",
                    },
                ],
            });
        }
        try {
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ accesstoken })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    //get all users
    allUser: async (req, res) => {
        try {
            const { page = 1, limit = 50, status } = req.query;
            if (status) {
                const total = await Users.find({ status: status })

                const user = await Users.find({ status: status }).sort({ "createdAt": -1 }).select('-password -__v').limit(limit * 1).skip((page - 1) * limit)
                if (!user) return res.status(400).json({ msg: "User does not exist." })
                res.status(200).json({ total: total.length, user })
            }
            if (!status) {
                const total = await Users.find()
                const user = await Users.find().select('-password -__v').limit(limit * 1).skip((page - 1) * limit)
                if (!user) return res.status(400).json({ msg: "User does not exist." })
                res.status(200).json({ total: total.length, user })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },



    //get single user

    getUser: async (req, res) => {
        const userId = req.params.id
        try {
            const user = await Users.findOne({ _id: userId }).select('-password -__v')
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            if (user.role === 0) {
                const approvedBalance = await balance.find({ "user": userId, status: "Approved" })
                const approveReacharge = await recharge.find({ "user": userId, status: "Approved" })
                const rejectedReacharge = await recharge.find({ "user": userId, status: "Rejected" })
                const pendingReacharge = await recharge.find({ "user": userId, status: "Pending" })
                const pendingMobileBanking = await mobileBanking.find({ "user": userId, status: "Pending" })
                const approvedMobileBanking = await mobileBanking.find({ "user": userId, status: "Approved" })
                let pendingMobileBankingAmount = pendingMobileBanking.reduce((sum, item) => sum + item.amount, 0);
                let approvedMobileBankingAmount = approvedMobileBanking.reduce((sum, item) => sum + item.amount, 0);
                let rejectedReachargeAmount = rejectedReacharge.reduce((sum, item) => sum + item.amount, 0);
                let pendingReachargeAmount = pendingReacharge.reduce((sum, item) => sum + item.amount, 0);
                let approveReachargeAmount = approveReacharge.reduce((sum, item) => sum + item.amount, 0);
                let approvedBalanceAmount = approvedBalance.reduce((sum, item) => sum + item.amount, 0);
                let amount = (approvedBalanceAmount - (approveReachargeAmount + pendingReachargeAmount + approvedMobileBankingAmount + pendingMobileBankingAmount))
                const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                    $set: {
                        deposit: approvedBalanceAmount,
                        pending_recaharge: pendingReachargeAmount,
                        total_pending: pendingReacharge.length,
                        amount,
                        pending_Mobile_Banking_Amount: pendingMobileBankingAmount,
                        mobileBCount: pendingMobileBanking.length

                    }
                }, { new: true });

                res.status(200).json(updateUser)
            }
            else {
                const pendingMobileBanking = await mobileBanking.find({ status: "Pending" })
                const pendingReacharge = await recharge.find({ status: "Pending" })
                let pendingReachargeAmount = pendingReacharge.reduce((sum, item) => sum + item.amount, 0);
                const PendingBalance = await balance.find({ status: "Pending" });
                let amount = PendingBalance.reduce((sum, item) => sum + item.amount, 0);
                let pendingMobileBankingAmount = pendingMobileBanking.reduce((sum, item) => sum + item.amount, 0);
                const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                    $set: {
                        amount,
                        pending_recaharge: pendingReachargeAmount,
                        total_pending: pendingReacharge.length,
                        pending_Mobile_Banking_Amount: pendingMobileBankingAmount,
                        mobileBCount: pendingMobileBanking.length
                    }
                }, { new: true });
                if (updateUser) {
                    res.status(200).json(updateUser)
                }
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },




    statusUpdate: async (req, res) => {
        const userId = req.params.id
        const { status } = req.body
        try {
            const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                $set: {
                    status
                }
            }, { new: true });
            res.status(200).json({ msg: "Updated Successfully", updateUser: updateUser });
        } catch (error) {
            res.status(400).json(error);
        }
    },


    editUser: async (req, res) => {
        const userId = req.params.id
        try {
            const user = await Users.findOne({ _id: userId })

            if (req.file && req.file.filename) {
                const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                    $set: {
                        ...req.body,
                        avatar: req.file.filename,
                    }
                }, { new: true });

                unlink(
                    path.join(path.dirname(__dirname), `/uploads/${user.avatar}`),
                    (err) => {
                        if (err) console.log(err);
                    }

                );


                res.status(200).json({ msg: "Updated Successfully", updateUser: updateUser });

            } else {
                const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                    $set: {
                        ...req.body,
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updateUser: updateUser });

            }

            // Save mongodb
            // await newUser.save()
            // Then create jsonwebtoken to authentication


        } catch (err) {
            return res.status(400).json({ msg: err.message })
        }
    }
}
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl