const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const rechargeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    number: {
        type: String,
        required: true,

    },
    invoice: {
        type: Number,
        auto: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    note: {
        type: String,
        trim: true,
        default: "Thanks For Working With Us. best Of Luck"
    },
    simOperator: {
        type: String,
        required: true,
        default: " "
    }
},
    {
        timestamps: true
    },
)

autoIncrement.initialize(mongoose.connection);
rechargeSchema.plugin(autoIncrement.plugin, {
    model: "post", // collection or table name in which you want to apply auto increment
    field: "invoice", // field of model which you want to auto increment
    startAt: 200000, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});
module.exports = mongoose.model('recharge', rechargeSchema);