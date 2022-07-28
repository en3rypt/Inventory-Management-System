const express = require('express');
const rvouchers = express.Router();
const db = require('../dbConnection');

rvouchers.get('/new', (req, res) => {
    db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM schemes`, (err, schemesResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM stations`, (err, stationsResult) => {
                if (err) {
                    throw err;
                }
                res.render('pages/index', { option: "newRV", itemRows: itemRowResult, schemeRows: schemesResult, stationRows: stationsResult });
                // res.send('hi')
            })
        })
    })
})

rvouchers.get('/', (req, res) => {
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
                // console.log(rvItemlist);
                // console.log(itemRowResult);
                res.render('pages/index', { option: "rvouchers", rvouchersData: result, itemRows: itemRowResult, rvItemlist: rvItemlist });
            });
        });
    });
});

rvouchers.post('/new', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO receivedvouchers (RVNo, RVYear, Supplier, Scheme, SNo, DateOfReceival) VALUES (${req.body.rvid}, ${req.body.rvyear}, ${req.body.stationid}, ${req.body.schemeid}, ${req.body.sno}, '${new Date(req.body.dor).toISOString().slice(0, 10)}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    // console.log(addedJSON);
                    // console.log(itemNameIDResult);
                    db.query(`SELECT LAST_INSERT_ID() as lastID FROM receivedvouchers`, (err, lastVoucherResult) => {
                        if (err) {
                            throw err;
                        }
                        // console.log(lastVoucherResult);
                        db.query(`INSERT INTO rvitems (rvID, rvItemID, rvItemQty, rvItemRefNo, rvItemRefDate) VALUES (${lastVoucherResult[0].lastID}, ${itemNameIDResult[0].ID}, ${addedJSON[itemNameIDResult[0].Name].reqQty}, ${addedJSON[itemNameIDResult[0].Name].refNo}, '${new Date(addedJSON[itemNameIDResult[0].Name].refDate).toISOString().slice(0, 10)}')`, (err, result) => {
                            if (err) {
                                throw err;
                            }
                        })
                    })
                })
            }
            res.redirect('/rvouchers');
        }
    );
})

rvouchers.post('/action/:Id', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`select items.ID,rvitems.vItemQty from rvitems inner JOIN items where rvitems.vID =${req.params.Id} and rvitems.vItemID = items.ID`, (err, vItemResult) => {
            if (err) {
                throw err;
            }

            //loop result and update the quantity of the item in the inventory
            vItemResult.forEach(row => {
                db.query(`UPDATE items SET Quantity = Quantity + ${row.vItemQty} WHERE ID = ${row.ID}`, (err, result) => {
                    if (err) {
                        throw err;
                    }
                }
                );
            }
            );
            //update the status of the voucher to accepted
            db.query(`UPDATE receivedvouchers SET Approval = 1 WHERE ID = ${req.params.Id}`, (err, result) => {
                if (err) {
                    throw err;
                }
            }
            );
            res.redirect('/rvouchers');

            // if (vItemResult.length > 0) {
            //     console.log("Error");
            // } else {
            //     //update stock in items
            //     db.query(`UPDATE items SET Quantity = Quantity - rvitems.vItemQty WHERE items.ID = rvitems.vItemID;`, (err, result) => {
            //         if (err) {
            //             throw err;
            //         }
            //         //update the status of the voucher to accepted
            //         db.query(`UPDATE receivedvouchers SET status = 1 WHERE ID = ${req.params.Id};`, (err, result) => {
            //             if (err) {
            //                 throw err;
            //             }
            //             res.redirect('/receivedvouchers');
            //         }
            //         );
            //     }
            //     );
            // }
        })
        //get all items from rvitems table by id
        // db.query(`SELECT * FROM rvitems WHERE vID = ${req.params.Id}`, (err, result) => {
        //     if (err) {
        //         throw err;
        //     }
        //     // console.log(result);
        //     flag = true;
        //     result.forEach(row => {
        //         //get item quantity from items table by id
        //         db.query(`SELECT * FROM items WHERE ID = ${row.vItemID}`, (err, itemResult) => {
        //             if (err) {
        //                 throw err;
        //             }

        //             if (itemResult[0].Quantity >= row.vItemQty) {

        //             } else {
        //                 flag = false;
        //             }
        //             // row.vItemQty.filter(n => !itemResult.includes(n))
        //             //check if item quantity is enough
        //             // if (itemResult[0].Quantity >= row.vItemQty) {
        //             //     //update item quantity
        //             //     db.query(`UPDATE items SET Quantity = Quantity - ${row.vItemQty} WHERE ID = ${row.vItemID}`, (err, result) => {
        //             //         if (err) {
        //             //             throw err;
        //             //         }
        //             //     });
        //             // } else {
        //             //     //if item quantity is not enough, show error message
        //             //     res.render('pages/index', { option: "receivedvouchers", error: "Item quantity is not enough" });
        //             // }
        //         });
        //     });
        // });


    } else {
        //db query to set approval to 2
        db.query(`UPDATE receivedvouchers SET approval = 2 WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/rvouchers');
        }
        );

    }
})



module.exports = rvouchers;