const express = require('express');
const report = express.Router();
const db = require('../dbConnection');

report.get('/', (req, res) => {
    db.query(`SELECT * FROM receivedvouchers`, (err, rresult) => {
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
                db.query(`SELECT * FROM issuedvouchers;`, (err, iresult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`SELECT * FROM items;`, (err, itemRowResult) => {
                        if (err) {
                            throw err;
                        }
                        db.query(`SELECT * FROM issuedvouchers INNER JOIN ivitems ON issuedvouchers.ID = ivitems.ivID INNER JOIN items ON ivitems.ivItemID = items.ID;`, (err, ivItemResult) => {
                            if (err) {
                                throw err;
                            }
                            let ivItemlist = {};
                            ivItemResult.forEach(row => {
                                if (!ivItemlist[row.ivID])
                                    ivItemlist[row.ivID] = {};
                                ivItemlist[row.ivID][row.Name] = {
                                    'req': row.ivQtyReq,
                                    'passed': row.ivQtyPassed
                                }
                            });

                            res.render('pages/index', { option: "report", rvouchersData: rresult, itemRows: itemRowResult, rvItemlist: rvItemlist, ivouchersData: iresult, itemRows: itemRowResult, ivItemlist: ivItemlist, error: null });
                        });
                    });
                });
            });
        });
    });
})






module.exports = report;