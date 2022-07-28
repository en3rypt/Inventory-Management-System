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
        res.render('pages/index', { option: "stations", stationsData: result });
    });
})

stations.post('/new', (req, res) => {
    db.query(
        `INSERT INTO stations (Name) VALUES ('${req.body.stationname}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/stations');
        }
    );
})
module.exports = stations;