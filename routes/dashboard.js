const express = require('express');
const dashboard = express.Router();
const db = require('../dbConnection');

dashboard.get('/', async (req, res) => {
    db.query(`SELECT count(*) as iPendCount FROM invouchers WHERE Approval=0`, (err, iResult) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT count(*) as oPendCount FROM outvouchers WHERE Approval=0`, (err, oResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT vItemID, items.Name FROM voucheritems JOIN items ON vItemID = items.ID GROUP BY vItemID ORDER BY SUM(vItemQty) DESC limit 1`, (err, mostExchangedResult) => {
                if (err) {
                    throw err;
                }
                db.query(`SELECT Name FROM items JOIN voucheritems ON items.ID = vItemID JOIN outvouchers ON vID = outvouchers.ID WHERE Approval=0 ORDER BY vItemQty DESC limit 1`, (err, mostDemandResult) => {
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
                    res.render('pages/index', { option: 'dashboard', iPendCount: iResult[0].iPendCount, oPendCount: oResult[0].oPendCount, mostExchanged: mostExchangedResult[0], mostDemand: mostDemandResult[0] });
                })
            })
        })
    })

});


module.exports = dashboard;