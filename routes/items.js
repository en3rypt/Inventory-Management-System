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



items.get('/edit/:id', (req, res) => {
    db.query(`SELECT * FROM items WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        db.query(`SELECT * FROM categories`, (err, categResult) => {
            if (err) throw err;
            console.log(categResult);
            res.render('pages/index', { option: 'editItem', result: result[0], categs: categResult, id: req.params.id });
        }
        )
    }
    )

})
items.post('/edit/:id', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {
        db.query(`UPDATE items SET CategoryID = ${req.body.categoryid}, Name = '${req.body.itemname}', Life = ${req.body.itemlife} WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/items');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM items WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/items');
        }
        )
    }


})
module.exports = items;