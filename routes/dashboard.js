const express = require('express');
const dashboard = express.Router();
const db = require('../dbConnection');

dashboard.get('/', async (req, res) => {
    db.query(`SELECT count(*) as  rPendCount FROM receivedvouchers WHERE Approval=0`, (err, rResult) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT count(*) as iPendCount FROM issuedvouchers WHERE Approval=0`, (err, iResult) => {
            if (err) {
                throw err;
            }
            res.render('pages/index', { option: 'dashboard', rPendCount: rResult[0].rPendCount, iPendCount: iResult[0].iPendCount });
        })
    })

});


module.exports = dashboard;