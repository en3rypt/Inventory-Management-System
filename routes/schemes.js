const express = require('express');
const schemes = express.Router();
const db = require('../dbConnection');

schemes.get('/new', (req, res) => {
    res.render('pages/index', { option: 'newScheme' });
})
schemes.get('/', (req, res) => {

    db.query(`SELECT * FROM schemes`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "schemes", schemesData: result });
    });
})

schemes.post('/new', (req, res) => {
    db.query(
        `INSERT INTO schemes (Name) VALUES ('${req.body.schemename}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/schemes');
        }
    );
})
module.exports = schemes;