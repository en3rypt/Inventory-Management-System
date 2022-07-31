//express project setup
const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');
const login = require('./routes/login');
const signup = require('./routes/signup');
const items = require('./routes/items');
const ivouchers = require('./routes/ivouchers');
const rvouchers = require('./routes/rvouchers');
const categories = require('./routes/categories');
const dashboard = require('./routes/dashboard');
const stations = require('./routes/stations');
const schemes = require('./routes/schemes');
const charts = require('./routes/charts');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { requireAuth, checkUser, authRole } = require('./middleware/authMiddleware')


const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));




// app.get('/orders', requireAuth, (req, res) => {
//     res.render('pages/orders');
// })
// MiddlWares
app.get('*', checkUser);
app.use('/login', login);
app.use('/signup', signup);
app.use('/items', requireAuth, items);
app.use('/rvouchers', requireAuth, rvouchers);
app.use('/ivouchers', requireAuth, ivouchers);
app.use('/categories', requireAuth, categories);
app.use('/stations', requireAuth, stations);
app.use('/schemes', requireAuth, schemes);
app.use('/charts', requireAuth, charts);
app.use('/', requireAuth, dashboard);



app.get('/Categories', (req, res) => {
    res.render('pages/Categories', { option: 'dashboard' });
})

app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
})
//app listen
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT} .`));

