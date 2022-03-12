const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("database connection successful!")
    }
    catch (error) {
        console.log("mongoDb Connection error");
        process.exit(1)
    }
}
module.exports = connectDB;