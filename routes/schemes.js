const express = require('express');
const schemes = express.Router();
const db = require('../dbConnection');

schemes.get('/new', (req, res) => {
    res.render('pages/index', { option: 'newScheme' });
})
schemes.get('/', (req, res) => {

    db.query(`SELECT * FROM categories`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "schemes", categoriesData: result });
    });
})

// categories.post('/', (req, res) => {
//     db.query(
//         `INSERT INTO categories (Name) VALUES ('${req.body.categname}')`,
//         (err, result) => {
//             if (err) {
//                 throw err;
//             }
//             res.redirect('/categories');
//         }
//     );
// })
module.exports = schemes;