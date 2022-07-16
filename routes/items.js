const express = require('express');
const items = express.Router();
const db = require('../dbConnection');


items.get('/', (req, res) => {
    db.query(`SELECT * FROM items`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT ID FROM categories`, (err, categResult) => {
            if (err) {
                throw err;
            }
            const categs = categResult.map(categ => categ.ID);
            res.render('pages/index', { option: "items", itemsData: result, categs: categs });
        });
    });
});



items.post('/', (req, res) => {
    db.query(
        `INSERT INTO items (CategoryID, Name, Quantity) VALUES ( ${req.body.categoryid}, '${req.body.itemname}', ${req.body.itemquantity})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/items');
        }
    );
})


module.exports = items;