const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const MobileBankingModalSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    Mobile_Banking_Operator: {
        type: String,
        required: true,
        default: "Hand Cash",
        trim: true
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
    type: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    }
},
    {
        timestamps: true
    },
)
autoIncrement.initialize(mongoose.connection);
MobileBankingModalSchema.plugin(autoIncrement.plugin, {
    model: "post", // collection or table name in which you want to apply auto increment
    field: "invoice", // field of model which you want to auto increment
    startAt: 100, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
})
module.exports = mongoose.model('mobileBanking', MobileBankingModalSchema);