const express = require('express');
const stations = express.Router();
const db = require('../dbConnection');
const { authRole } = require('../middleware/authMiddleware');

stations.get('/new', authRole([2, 3]), (req, res) => {
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

stations.post('/new', authRole([2, 3]), (req, res) => {
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

stations.get('/edit/:id', (req, res) => {
    db.query(`SELECT * FROM stations WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        res.render('pages/index', { option: 'editStation', inputVal: result[0].Name, id: req.params.id });
    }
    )
})
stations.post('/edit/:id', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {
        db.query(`UPDATE stations SET Name = '${req.body.stationname}' WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/stations');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM stations WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/stations');
        }
        )
    }

})
module.exports = stations;