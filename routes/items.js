const express = require('express');
const items = express.Router();
const db = require('../dbConnection');


items.get('/new', (req, res) => {
    db.query(`SELECT * FROM categories`, (err, categResult) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "newItem", categs: categResult });
    });
})

items.get('/', (req, res) => {
    db.query(`SELECT * FROM items`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM categories`, (err, categResult) => {
            if (err) {
                throw err;
            }
            res.render('pages/index', { option: "items", itemsData: result, categs: categResult });
        });
    });
});



items.post('/new', (req, res) => {
    db.query(
        `INSERT INTO items (CategoryID, Name, Quantity, Life) VALUES ( ${req.body.categoryid}, '${req.body.itemname}', ${req.body.itemquantity}, ${req.body.itemlife})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/items');
        }
    );
})


module.exports = items;