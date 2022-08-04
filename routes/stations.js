const express = require('express');
const stations = express.Router();
const db = require('../dbConnection');
const { authRole } = require('../middleware/authMiddleware');

stations.get('/new', authRole([2, 3]), (req, res) => {
    res.render('pages/index', { option: 'newStation' });
})
stations.get('/', (req, res) => {
    var status = req.query.status;
    if (!(status == 'Addsuccess' || status == 'Deletesuccess' || status == 'Editsuccess' || status == 'Existerror')) {
        status = null;
    }
    db.query(`SELECT * FROM stations`, (err, result) => {
        // console.log(result);

        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "stations", stationsData: result, status: status });
    });
})

stations.post('/new', (req, res) => {
    //checkif station already exists in database
    db.query(`SELECT * FROM stations WHERE Name = '${req.body.stationname}'`, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.redirect('/stations?status=Existerror');
        } else {

            db.query(
                `INSERT INTO stations (Name) VALUES ('${req.body.stationname}')`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log(result);
                    res.redirect('/stations?status=Addsuccess');
                }
            );
        }
    });
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
            res.redirect('/stations?status=Editsuccess');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM stations WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/stations?status=Deletesuccess');
        }
        )
    }

})
module.exports = stations;