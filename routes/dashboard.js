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
            db.query(`SELECT ivID, items.Name FROM ivitems JOIN items ON ivID = items.ID GROUP BY ID ORDER BY SUM(ivQtyPassed) DESC limit 1;`, (err, mostExchangedResult) => {
                if (err) {
                    throw err;
                }
                db.query(`SELECT Name FROM items JOIN ivitems ON items.ID = ivItemID JOIN issuedvouchers ON ivID = issuedvouchers.ID WHERE Approval=0 ORDER BY ivQtyReq DESC limit 1;`, (err, mostDemandResult) => {
                    if (err) {
                        throw err;
                    }

                    //Handling the case where there is no data in the table.
                    if (!mostExchangedResult.length) {
                        mostExchangedResult.push({ Name: "NIL" });
                    }
                    if (!mostDemandResult.length) {
                        mostDemandResult.push({ Name: "NIL" });
                    }
                    res.render('pages/index', { option: 'dashboard', rPendCount: rResult[0].rPendCount, iPendCount: iResult[0].iPendCount, mostExchanged: mostExchangedResult[0], mostDemand: mostDemandResult[0] });
                })
            })
        })
    })

});


module.exports = dashboard;