const express = require('express');
const ivouchers = express.Router();
const db = require('../dbConnection');


ivouchers.get('/new', (req, res) => {
    db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "newIV", itemRows: itemRowResult });
        // res.send('hi')
    })
})
ivouchers.get('/', (req, res) => {
    db.query(`SELECT * FROM issuedvouchers`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM issuedvouchers INNER JOIN ivitems ON issuedvouchers.ID = ivitems.vID INNER JOIN items ON ivitems.vItemID = items.ID WHERE ivitems.vType = 1;`, (err, vItemResult) => {
                if (err) {
                    throw err;
                }
                db.query(`select ivitems.vID,items.Name,ivitems.vItemQty,items.Quantity - ivitems.vItemQty as balance from ivitems inner JOIN items where ivitems.vItemID = items.ID`, (err, vBalanceResult) => {
                    if (err) {
                        throw err;
                    }
                    let lessBalanceList = [];
                    // console.log(vBalanceResult);
                    vBalanceResult.forEach(vBalance => {
                        if (vBalance.balance < 0) {
                            lessBalanceList.push(vBalance);
                        }
                    });
                    let ovItemlist = {};
                    vItemResult.forEach(row => {
                        if (!ovItemlist[row.vID])
                            ovItemlist[row.vID] = {};
                        ovItemlist[row.vID][row.Name] = row.vItemQty;
                    });

                    // console.log("OVITEMLIST", ovItemlist);
                    // console.log("LESSBALANCELIST", lessBalanceList);
                    // console.log(itemRowResult);
                    res.render('pages/index', { option: "issuedvouchers", issuedvouchersData: result, itemRows: itemRowResult, ovItemlist: ovItemlist, lessBalanceList: lessBalanceList, error: null });
                })
            });
        });
    });
});

ivouchers.post('/action/:Id', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`select items.ID,ivitems.vItemQty,items.Quantity - ivitems.vItemQty as balance from ivitems inner JOIN items where ivitems.vID =${req.params.Id} and ivitems.vItemID = items.ID`, (err, vItemResult) => {
            if (err) {
                throw err;
            }
            console.log(vItemResult);
            let result = vItemResult.map(a => a.balance).some(v => v < 0);
            if (result) {
                // This block will never execute. If it happens, well, we failed.
                console.log("Not enough quantity");
            } else {
                //loop result and update the quantity of the item in the inventory
                vItemResult.forEach(row => {
                    db.query(`UPDATE items SET Quantity = Quantity - ${row.vItemQty} WHERE ID = ${row.ID}`, (err, result) => {
                        if (err) {
                            throw err;
                        }
                    }
                    );
                }
                );
                //update the status of the voucher to accepted
                db.query(`UPDATE issuedvouchers SET Approval = 1 WHERE ID = ${req.params.Id}`, (err, result) => {
                    if (err) {
                        throw err;
                    }
                }
                );
                res.redirect('/ivouchers');
            }
            // if (vItemResult.length > 0) {
            //     console.log("Error");
            // } else {
            //     //update stock in items
            //     db.query(`UPDATE items SET Quantity = Quantity - ivitems.vItemQty WHERE items.ID = ivitems.vItemID;`, (err, result) => {
            //         if (err) {
            //             throw err;
            //         }
            //         //update the status of the voucher to accepted
            //         db.query(`UPDATE issuedvouchers SET status = 1 WHERE ID = ${req.params.Id};`, (err, result) => {
            //             if (err) {
            //                 throw err;
            //             }
            //             res.redirect('/issuedvouchers');
            //         }
            //         );
            //     }
            //     );
            // }
        })
        //get all items from ivitems table by id
        // db.query(`SELECT * FROM ivitems WHERE vID = ${req.params.Id}`, (err, result) => {
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
        //             //     res.render('pages/index', { option: "issuedvouchers", error: "Item quantity is not enough" });
        //             // }
        //         });
        //     });
        // });


    } else {
        //db query to set approval to 2
        db.query(`UPDATE issuedvouchers SET approval = 2 WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/ivouchers');
        }
        );

    }
})


ivouchers.post('/', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    // console.log(addedJSON);
    db.query(
        `INSERT INTO issuedvouchers (ID, ReceiverID) VALUES (${req.body.reqid},${req.body.reqreceiverid})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }
                    db.query(`INSERT INTO ivitems (vID, vType, vItemID, vItemQty) VALUES (${req.body.reqid}, 1, ${itemNameIDResult[0].ID},${addedJSON[itemNameIDResult[0].Name]})`, (err, result) => {
                        if (err) {
                            throw err;
                        }
                    })
                })
            }
            res.redirect('/ivouchers');
        }
    );
})


module.exports = ivouchers;