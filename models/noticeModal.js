const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const noticeSchema = new mongoose.Schema({
    notice: {
        type: String,
        require: true,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "active"
    },
    id: {
        type: Number,
        auto: true
    },

},
    {
        timestamps: true
    },

);
autoIncrement.initialize(mongoose.connection);
noticeSchema.plugin(autoIncrement.plugin, {
    model: "post", // collection or table name in which you want to apply auto increment
    field: "id", // field of model which you want to auto increment
    startAt: 1, // start your auto increment value from 1
    incrementBy: 1, // incremented by 1
});
module.exports = mongoose.model('notice', noticeSchema);

