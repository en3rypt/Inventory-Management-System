const express = require('express');
const invouchers = express.Router();
const db = require('../dbConnection');

invouchers.get('/new', (req, res) => {
    db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "newInvoucher", itemRows: itemRowResult });
        // res.send('hi')
    })
})

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


invouchers.post('/action/:Id', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`select items.ID,voucheritems.vItemQty from voucheritems inner JOIN items where voucheritems.vID =${req.params.Id} and voucheritems.vItemID = items.ID`, (err, vItemResult) => {
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
            db.query(`UPDATE invouchers SET Approval = 1 WHERE ID = ${req.params.Id}`, (err, result) => {
                if (err) {
                    throw err;
                }
            }
            );
            res.redirect('/invouchers');

            // if (vItemResult.length > 0) {
            //     console.log("Error");
            // } else {
            //     //update stock in items
            //     db.query(`UPDATE items SET Quantity = Quantity - voucheritems.vItemQty WHERE items.ID = voucheritems.vItemID;`, (err, result) => {
            //         if (err) {
            //             throw err;
            //         }
            //         //update the status of the voucher to accepted
            //         db.query(`UPDATE invouchers SET status = 1 WHERE ID = ${req.params.Id};`, (err, result) => {
            //             if (err) {
            //                 throw err;
            //             }
            //             res.redirect('/invouchers');
            //         }
            //         );
            //     }
            //     );
            // }
        })
        //get all items from voucheritems table by id
        // db.query(`SELECT * FROM voucheritems WHERE vID = ${req.params.Id}`, (err, result) => {
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
        //             //     res.render('pages/index', { option: "invouchers", error: "Item quantity is not enough" });
        //             // }
        //         });
        //     });
        // });


    } else {
        //db query to set approval to 2
        db.query(`UPDATE invouchers SET approval = 2 WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/invouchers');
        }
        );

    }
})



module.exports = invouchers;