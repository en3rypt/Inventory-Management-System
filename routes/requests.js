const express = require('express');
const requests = express.Router();
const db = require('../dbConnection');


requests.get('/', (req, res) => {
    db.query(`SELECT * FROM requests`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT ID FROM categories`, (err, categResult) => {
            if (err) {
                throw err;
            }
            const categs = categResult.map(categ => categ.ID);
            res.render('pages/index', { option: "requests", requestsData: result, categs: categs });
        });
    });
});



requests.post('/', (req, res) => {
    db.query(
        `INSERT INTO requests (CategoryID, Name, Quantity) VALUES ( ${req.body.categoryid}, '${req.body.itemname}', ${req.body.itemquantity})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/requests');
        }
    );
})


module.exports = requests;