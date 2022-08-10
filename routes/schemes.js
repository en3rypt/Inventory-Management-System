const express = require('express');
const schemes = express.Router();
const db = require('../dbConnection');
const { authRole } = require('../middleware/authMiddleware');

schemes.get('/new', authRole([2, 3]), (req, res) => {
    res.render('pages/index', { option: 'newScheme' });
})

schemes.get('/edit/:id([0-9]+)', (req, res) => {
    db.query(`SELECT * FROM schemes WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        res.render('pages/index', { option: 'editScheme', inputVal: result[0].Name, id: req.params.id });
    }
    )
})
schemes.post('/edit/:id([0-9]+)', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {

        db.query(`UPDATE schemes SET Name = '${req.body.schemename}' WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/schemes?status=Editsuccess');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM schemes WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/schemes?status=Deletesuccess');
        }
        )
    }

})


schemes.get('/', (req, res) => {

    var status = req.query.status;
    if (!(status == 'Addsuccess' || status == 'Deletesuccess' || status == 'Editsuccess' || status == 'Existerror')) {
        status = null;
    }

    db.query(`SELECT * FROM schemes`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "schemes", schemesData: result, status: status });
    });
})

schemes.post('/new', (req, res) => {
    //check if scheme already exists in database\
    db.query(`SELECT * FROM schemes WHERE Name = '${req.body.schemename}'`, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.redirect('/schemes?status=Existerror');
        } else {

            db.query(
                `INSERT INTO schemes (Name) VALUES ('${req.body.schemename}')`,
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/schemes?status=Addsuccess');
                }
            );

        }
    });

})
module.exports = schemes;