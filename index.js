//express project setup
const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routes/routes');
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


app.get('*', checkUser);
app.get('/', requireAuth, authRole(1), (req, res) => {
    res.render('pages/dashboard');
})

app.get('/orders', requireAuth, (req, res) => {
    res.render('pages/orders');
})

// app.get('/signup', (req, res) => {
//     res.render('pages/signup');
// })

// app.post('/signup', (req, res) => {
//     res.send(`The Name is ${req.body.suName} and the email is ${req.body.suEmail}`);
// })


app.post('/orders', (req, res) => {
    res.send(`The ID is ${req.body.itemid} and the category is ${req.body.categoryid}, the name is ${req.body.itemname} and the quantity is ${req.body.itemquantity}`);
})

app.use('/', router);


//app listen
app.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}`));
