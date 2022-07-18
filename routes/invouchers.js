const express = require('express');
const invouchers = express.Router();
const db = require('../dbConnection');


invouchers.get('/', (req, res) => {
    db.query(`SELECT * FROM invouchers`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM invouchers INNER JOIN voucheritems ON invouchers.ID = voucheritems.vID INNER JOIN items ON voucheritems.vItemID = items.ID WHERE voucheritems.vType = 0;`, (err, vItemResult) => {
                if (err) {
                    throw err;
                }
                let ivItemlist = {};
                vItemResult.forEach(row => {
                    if (!ivItemlist[row.vID])
                        ivItemlist[row.vID] = {};
                    ivItemlist[row.vID][row.Name] = row.vItemQty;
                });
                // console.log(itemRowResult);
                res.render('pages/index', { option: "invouchers", invouchersData: result, itemRows: itemRowResult, ivItemlist: ivItemlist });
            });
        });
    });
});



invouchers.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO invouchers (ID, SupplierID) VALUES (${req.body.reqid},${req.body.reqsupplierid})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`INSERT INTO voucheritems (vID, vType, vItemID, vItemQty) VALUES (${req.body.reqid}, 0, ${itemNameIDResult[0].ID},${addedJSON[itemNameIDResult[0].Name]})`, (err, result) => {
                        if (err) {
                            throw err;
                        }
                    })
                })
            }
            res.redirect('/invouchers');
        }
    );
})

module.exports = invouchers;