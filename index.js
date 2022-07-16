//express project setup
const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');
const login = require('./routes/login');
const signup = require('./routes/signup');
const items = require('./routes/items');
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
app.use('/login', login);
app.use('/signup', signup);
app.use('/items', requireAuth, items);
app.get('*', checkUser);
app.get('/', requireAuth, authRole(1), (req, res) => {
    res.render('pages/dashboard');
})



app.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
})
//app listen
app.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}`));
