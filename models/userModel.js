const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    user_address: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: false
    },

    r_name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    shope_name: {
        type: String,
        require: true,
        required: true,
        trim: true
    },
    avatar: {
        type: String,

    },
    number: {
        type: String,
        require: true,
        trim: true,
    },

    role: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "Pending"
    },
    id: {
        type: Number,
        auto: true
    },
    amount: {
        type: Number,
        default: 0,
    },
    pending_recaharge: {
        type: Number,
        default: 0,
    },
    total_pending: {
        type: Number,
        default: 0,
    },
    pending_Mobile_Banking_Amount: {
        type: Number,
        default: 0
    },
    mobileBCount: {
        type: Number,
        default: 0
    },
    deposit: {
        type: Number,
        default: 0
    },
    country: {
        type: String
    }
},
    {
        timestamps: true
    },

);
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
    model: "post", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});
module.exports = mongoose.model('Users', userSchema);

