const express = require('express');
const outvouchers = express.Router();
const db = require('../dbConnection');


outvouchers.get('/', (req, res) => {
    db.query(`SELECT * FROM outvouchers`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM outvouchers INNER JOIN requesteditems ON outvouchers.ID = requesteditems.ReqID INNER JOIN items ON requesteditems.ReqItemID = items.ID;`, (err, reqItemResult) => {
                if (err) {
                    throw err;
                }
                let ovItemlist = {};
                reqItemResult.forEach(row => {
                    if (!ovItemlist[row.ReqID])
                        ovItemlist[row.ReqID] = {};
                    ovItemlist[row.ReqID][row.Name] = row.ReqItemQty;
                });
                console.log(itemRowResult);
                res.render('pages/index', { option: "outvouchers", outvouchersData: result, itemRows: itemRowResult, ovItemlist: ovItemlist });
            });
        });
    });
});



outvouchers.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO outvouchers (ID, StationID) VALUES (${req.body.reqid},${req.body.reqstationid})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`INSERT INTO requesteditems (ReqID, ReqItemID, ReqItemQty) VALUES (${req.body.reqid},${itemNameIDResult[0].ID},${addedJSON[itemNameIDResult[0].Name]})`, (err, result) => {
                        if (err) {
                            throw err;
                        }
                    })
                })
            }
            res.redirect('/outvouchers');
        }
    );
})


module.exports = outvouchers;