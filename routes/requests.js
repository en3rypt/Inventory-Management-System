const express = require('express');
const requests = express.Router();
const db = require('../dbConnection');


requests.get('/', (req, res) => {
    db.query(`SELECT * FROM requests`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM requests INNER JOIN requesteditems ON requests.ID = requesteditems.ReqID INNER JOIN items ON requesteditems.ReqItemID = items.ID;`, (err, reqItemResult) => {
                if (err) {
                    throw err;
                }
                let reqItemlist = {};
                reqItemResult.forEach(row => {
                    if (!reqItemlist[row.ReqID])
                        reqItemlist[row.ReqID] = {};
                    reqItemlist[row.ReqID][row.Name] = row.ReqItemQty;
                });
                res.render('pages/index', { option: "requests", requestsData: result, itemRows: itemRowResult, reqItemlist: reqItemlist });
            });
        });
    });
});



requests.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO requests (ID, StationID) VALUES (${req.body.reqid},${req.body.reqstationid})`,
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
            res.redirect('/requests');
        }
    );
})


module.exports = requests;