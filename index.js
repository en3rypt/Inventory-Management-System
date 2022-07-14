//express project setup
const express = require('express');
const app = express();
// const router = require('./routes/routes');


const PORT = 3000;
// const db = require('./dbConnection');
require('dotenv').config()
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



//home route
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard');
})

app.get('/orders', (req, res) => {
    res.render('pages/orders');
})

app.get('/signup', (req, res) => {
    res.render('pages/signup');
})

app.post('/signup', (req, res) => {
    res.send(`The Name is ${req.body.suName} and the email is ${req.body.suEmail}`);
})


app.post('/orders', (req, res) => {
    res.send(`The ID is ${req.body.itemid} and the category is ${req.body.categoryid}, the name is ${req.body.itemname} and the quantity is ${req.body.itemquantity}`);
})

// app.use('/', router);


//app listen
app.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}`));
