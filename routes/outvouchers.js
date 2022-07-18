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
            db.query(`SELECT * FROM outvouchers INNER JOIN voucheritems ON outvouchers.ID = voucheritems.vID INNER JOIN items ON voucheritems.vItemID = items.ID WHERE voucheritems.vType = 1;`, (err, vItemResult) => {
                if (err) {
                    throw err;
                }
                let ovItemlist = {};
                vItemResult.forEach(row => {
                    if (!ovItemlist[row.vID])
                        ovItemlist[row.vID] = {};
                    ovItemlist[row.vID][row.Name] = row.vItemQty;
                });
                // console.log(itemRowResult);
                res.render('pages/index', { option: "outvouchers", outvouchersData: result, itemRows: itemRowResult, ovItemlist: ovItemlist });
            });
        });
    });
});



outvouchers.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO outvouchers (ID, ReceiverID) VALUES (${req.body.reqid},${req.body.reqreceiverid})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`INSERT INTO voucheritems (vID, vType, vItemID, vItemQty) VALUES (${req.body.reqid}, 1, ${itemNameIDResult[0].ID},${addedJSON[itemNameIDResult[0].Name]})`, (err, result) => {
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