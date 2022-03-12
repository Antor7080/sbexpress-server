const mongoose = require("mongoose");
const simSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        require: true,
    },
    sim_name: {
        type: String,
        require: true,
    },

    sim_number: {
        type: Number,
        require: true,
    }

});

const Sim = mongoose.model('sim', simSchema);
module.exports = Sim;