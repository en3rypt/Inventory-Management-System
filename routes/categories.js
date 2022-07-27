const express = require('express');
const categories = express.Router();
const db = require('../dbConnection');

categories.get('/new', (req, res) => {
    res.render('pages/index', { option: 'newCategory' });
})
categories.get('/', (req, res) => {

    db.query(`SELECT * FROM categories`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "categories", categoriesData: result });
    });
})

categories.post('/new', (req, res) => {
    db.query(
        `INSERT INTO categories (Name) VALUES ('${req.body.categname}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/categories');
        }
    );
})
module.exports = categories;