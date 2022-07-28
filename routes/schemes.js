const express = require('express');
const schemes = express.Router();
const db = require('../dbConnection');

schemes.get('/new', (req, res) => {
    res.render('pages/index', { option: 'newScheme' });
})

schemes.get('/edit/:id', (req, res) => {
    db.query(`SELECT * FROM schemes WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        res.render('pages/index', { option: 'editScheme', inputVal: result[0].Name, id: req.params.id });
    }
    )
})
schemes.post('/edit/:id', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {

        db.query(`UPDATE schemes SET Name = '${req.body.schemename}' WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/schemes');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM schemes WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/schemes');
        }
        )
    }

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