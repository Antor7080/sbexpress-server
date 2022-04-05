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
    r_address: {
        type: String,
        trim: true
    },
    r_number: {
        type: String,
        trim: true
    },
    r_name: {
        type: String,
        trim: true
    },
    r_relation: {
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

    shop_address: {
        type: String,
        require: true,
        trim: true
    },
    number: {
        type: String,
        require: true,
        trim: true,

    },
    passport_no: {
        type: String,
        require: true,
        trim: true,

    },

    bank_name: {
        type: String,
        trim: true,
    },
    account_name: {
        type: String,
        trim: true,
    },
    account_number: {
        type: String,
        trim: true,
    },
    bank_b_name: {
        type: String,
        trim: true,
    },
    switt_code: {
        type: String,
        trim: true,
    },
    bkash: {
        type: String,
        trim: true,
    },
    nagad: {
        type: String,
        trim: true,
    },
    nagad: {
        type: String,
        trim: true,
    },
    rocket: {
        type: String,
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

