const Users = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { unlink } = require("fs");
const path = require("path");
const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password, shope_name, shop_address, number, user_address, } = req.body;
            // Password Encryption
            const email1 = email.toLowerCase()
            const passwordHash = await bcrypt.hash(password, 10)
            let newUser;
            // console.log(req.files);
            if (req.file && req.file.length > 0) {
                newUser = new Users({
                    ...req.body,
                    avatar: req.file.filename,
                    password: passwordHash,
                    email: email1
                });
            } else {
                newUser = new Users({
                    ...req.body,
                    password: passwordHash,
                    email: email1
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
            const user = await Users.findOne({ email });
            console.log(user);
            console.log(user.status);
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })
            const userData = { email: user.email, name: user.name, number: user.number, id: user.id, role: user.role, _id: user._id, avatar: user.avatar }
            res.json({ accesstoken, userData, msg: "Login Successfull!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {

        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })

            return res.json({ msg: "Logged out" });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })
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
            const { page = 1, limit = 10, status } = req.query;
            if (status) {
                const total = await Users.find({ status: status })
                const user = await Users.find({ status: status }).select('-password -__v').limit(limit * 1).skip((page - 1) * limit)
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
            res.status(200).json(user)

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
            console.log(user.avatar);
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

                console.log("new", updateUser.avatar);
                res.status(200).json({ msg: "Updated Successfully", updateUser: updateUser });

            } else {
                const updateUser = await Users.findOneAndUpdate({ _id: userId }, {
                    $set: {
                        ...req.body,
                    }
                }, { new: true });
                res.status(200).json({ msg: "Updated Successfully", updateUser: updateUser });
                console.log(updateUser);
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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1100m' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl