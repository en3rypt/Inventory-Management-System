const express = require('express');
const rvouchers = express.Router();
const db = require('../dbConnection');

rvouchers.get('/new', (req, res) => {
    db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "newRV", itemRows: itemRowResult });
        // res.send('hi')
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
            db.query(`SELECT * FROM receivedvouchers INNER JOIN rvitems ON receivedvouchers.ID = rvitems.vID INNER JOIN items ON rvitems.vItemID = items.ID WHERE rvitems.vType = 0;`, (err, vItemResult) => {
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
                res.render('pages/index', { option: "receivedvouchers", receivedvouchersData: result, itemRows: itemRowResult, ivItemlist: ivItemlist });
            });
        });
    });
});



rvouchers.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `INSERT INTO receivedvouchers (ID, SupplierID) VALUES (${req.body.reqid},${req.body.reqsupplierid})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`INSERT INTO rvitems (vID, vType, vItemID, vItemQty) VALUES (${req.body.reqid}, 0, ${itemNameIDResult[0].ID},${addedJSON[itemNameIDResult[0].Name]})`, (err, result) => {
                        if (err) {
                            throw err;
                        }
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