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

outvouchers.post('/action/:Id', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //check if stock is enough
        //check if required items are available
        //if yes, update stock
        //if no, send error message
        //if yes, update voucher status to accepted
        //if no, send error message
        // db.query(`SELECT * FROM outvouchers WHERE ID = ?`, [req.params.Id], (err, result) => {
        //     if (err) {
        //         throw err;
        //     }
        //     db.query(`SELECT * FROM voucheritems WHERE vID = ?`, [req.params.Id], (err, vItemResult) => {
        //         if (err) {
        //             throw err;
        //         }
        //         let ovItemlist = {};
        //         vItemResult.forEach(row => {
        //             if (!ovItemlist[row.vID])

        //                 ovItemlist[row.vID] = {};
        //             ovItemlist[row.vID][row.Name] = row.vItemQty;
        //         }
        //         );
        //         db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             let itemlist = {};
        //             itemRowResult.forEach(row => {
        //                 itemlist[row.ID] = row.Name;
        //             }
        //             );
        //             let stocklist = {};
        //             itemRowResult.forEach(row => {
        //                 stocklist[row.ID] = row.Stock;
        //             }
        //             );
        //             let reqItemlist = {};
        //             vItemResult.forEach(row => {
        //                 reqItemlist[row.Name] = row.vItemQty;
        //             }
        //             );
        //             let reqItemlist2 = {};
        //             vItemResult.forEach(row => {
        //                 reqItemlist2[row.Name] = row.vItemQty;
        //             }
        //             );




        // db.query(`SELECT * FROM items WHERE ID = ?`, [req.params.Id], (err, result) => {
        //     if (err) {
        //         throw err;
        //     }
        //     if (result[0].Stock < result[0].MinStock) {
        //         res.send("Stock is not enough");
        //     } else {
        //         db.query(`UPDATE items SET Stock = Stock - ? WHERE ID = ?`, [result[0].MinStock, req.params.Id], (err, result) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             db.query(`UPDATE outvouchers SET Status = 1 WHERE ID = ?`, [req.params.Id], (err, result) => {
        //                 if (err) {
        //                     throw err;
        //                 }
        //                 res.redirect('/outvouchers');
        //             }
        //             );
        //         }
        //         );
        //     }
        // }
        // );

        // //db query to set approval to 1
        // db.query(`UPDATE outvouchers SET approval = 1 WHERE ID = ?`, [req.params.Id], (err, result) => {
        //     if (err) {
        //         throw err;
        //     }
        //     res.redirect('/outvouchers');
        // }
        // );
        // //db quyery to reduve the quantity of the items
        // db.query(`SELECT * FROM voucheritems WHERE vID = ?`, [req.params.Id], (err, result) => {
        //     if (err) {
        //         throw err;
        //     }
        //     result.forEach(row => {
        //         db.query(`UPDATE items SET Quantity = Quantity - ? WHERE ID = ?`, [row.vItemQty, row.vItemID], (err, result) => {
        //             if (err) {
        //                 throw err;
        //             }
        //         }
        //         );
        //     }
        //     );
        //     console.log(result);
        // }
        // );

    } else {
        //db query to set approval to 2
        db.query(`UPDATE outvouchers SET approval = 2 WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/outvouchers');
        }
        );

    }
})


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