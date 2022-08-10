const express = require('express');
const categories = express.Router();
const db = require('../dbConnection');
const { authRole } = require('../middleware/authMiddleware');

categories.get('/new', authRole([2, 3]), (req, res) => {
    res.render('pages/index', { option: 'newCategory' });
})
categories.get('/', (req, res) => {
    var status = req.query.status;
    if (!(status == 'Addsuccess' || status == 'Deletesuccess' || status == 'Editsuccess' || status == 'Existerror')) {
        status = null;
    }

    db.query(`SELECT * FROM categories`, (err, result) => {
        // console.log(result);
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "categories", categoriesData: result, status: status });
    });
})

categories.post('/new', (req, res) => {
    db.query(
        `INSERT INTO categories (Name) VALUES ('${req.body.categname}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/categories?status=Addsuccess');
        }
    );
})

categories.get('/edit/:id([0-9])', (req, res) => {
    db.query(`SELECT * FROM categories WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        res.render('pages/index', { option: 'editCategory', inputVal: result[0].Name, id: req.params.id });
    }
    )
})
categories.post('/edit/:id([0-9])', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {
        db.query(`UPDATE categories SET Name = '${req.body.categname}' WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/categories?status=Editsuccess');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM categories WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/categories?status=Deletesuccess');
        }
        )
    }

})
module.exports = categories;