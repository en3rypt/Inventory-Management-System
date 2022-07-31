const express = require('express');
const report = express.Router();
const db = require('../dbConnection');

report.get('/', (req, res) => {
    db.query(`SELECT * FROM receivedvouchers`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM receivedvouchers INNER JOIN rvitems ON receivedvouchers.ID = rvitems.rvID INNER JOIN items ON rvitems.rvItemID = items.ID;`, (err, vItemResult) => {
                if (err) {
                    throw err;
                }
                let rvItemlist = {};
                vItemResult.forEach(row => {
                    if (!rvItemlist[row.rvID])
                        rvItemlist[row.rvID] = {};
                    rvItemlist[row.rvID][row.Name] = {
                        'req': row.rvItemQty,
                        'refno': row.rvItemRefNo,
                        'refdate': new Date(row.rvItemRefDate).toISOString().slice(0, 10)

                    }
                });
                console.log(result);
                console.log(rvItemlist);
                res.render('pages/index', { option: "report", rvouchersData: result, itemRows: itemRowResult, rvItemlist: rvItemlist });
            });
        });
    });
})






module.exports = report;