//express project setup
const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');
const login = require('./routes/login');
const signup = require('./routes/signup');
const items = require('./routes/items');
const outvouchers = require('./routes/outvouchers');
const invouchers = require('./routes/invouchers');
const categories = require('./routes/categories');
const dashboard = require('./routes/dashboard');
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
app.use('/invouchers', requireAuth, invouchers);
app.use('/outvouchers', requireAuth, outvouchers);
app.use('/categories', requireAuth, categories);
app.use('/', requireAuth, dashboard);

app.get('/Categories', (req, res) => {
    res.render('pages/Categories', { option: 'dashboard' });
})

app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
})
//app listen
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT} .`));





