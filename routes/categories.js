const express = require('express');
const categories = express.Router();
const db = require('../dbConnection');

categories.get('/', (req, res) => {

    db.query(`SELECT * FROM categories`, (err, result) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "categories", categoriesData: result });
    });
})

module.exports = categories;