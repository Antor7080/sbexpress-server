require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path');
const auth = require('./Middlewares/auth')
const bodyParser = require('body-parser');
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '/*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
    next();
});
// Routes
app.use('/user', require('./router/userRouter'))
app.use('/balance', require('./router/balanceRouter'))
app.use('/recharge', require('./router/rechargeRouter'))
app.use('/mobile-banking', require('./router/mobileBankingRouter'))
app.use('/notice', require('./router/noticeRouter'))
app.use('/TotalAmount', require('./router/TotalAmount'))
app.use('/uploads', express.static('./uploads'))


// Connect to mongodb
const URI = process.env.MONGO_CONNECTION_STRING
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB')
})

app.get('/', (req, res) => {
    res.send('Welcome')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})