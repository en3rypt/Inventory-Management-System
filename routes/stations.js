const express = require('express');
const stations = express.Router();
const db = require('../dbConnection');

stations.get('/new', (req, res) => {
    res.render('pages/index', { option: 'newStation' });
})
stations.get('/', (req, res) => {

    db.query(`SELECT * FROM stations`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "stations", categoriesData: result });
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
module.exports = stations;