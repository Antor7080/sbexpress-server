const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const balanceSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true,
        default: 0,
        trim: true
    },
    payment_method: {
        type: String,
        required: true,
        default: "Hand Cash",
        trim: true
    },
    note: {
        type: String,
        trim: true,
        default: "Thanks For Working With Us. best Of Luck"
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
    }


},
    {
        timestamps: true
    },
)

autoIncrement.initialize(mongoose.connection);
balanceSchema.plugin(autoIncrement.plugin, {
    model: "post", // collection or table name in which you want to apply auto increment
    field: "invoice", // field of model which you want to auto increment
    startAt: 1000000, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});
module.exports = mongoose.model('balance', balanceSchema);