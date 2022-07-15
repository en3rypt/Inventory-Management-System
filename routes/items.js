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
            res.render('pages/items', { itemsData: result, categs: categs });
        });
    });
});



items.post('/', (req, res) => {
    db.query(
        `INSERT INTO items (ID, CategoryID, Name, Quantity, DateOfReceival) VALUES ('${req.body.itemid}', ${req.body.categoryid}, '${req.body.itemname}', ${req.body.itemquantity}, current_timestamp())`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/items');
        }
    );
})


module.exports = items;