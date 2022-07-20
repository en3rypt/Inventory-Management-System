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
                res.render('pages/index', { option: "outvouchers", outvouchersData: result, itemRows: itemRowResult, ovItemlist: ovItemlist, error: null });
            });
        });
    });
});

outvouchers.post('/action/:Id', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`select items.Quantity - voucheritems.vItemQty as balance from voucheritems inner JOIN items where voucheritems.vID =1000 and voucheritems.vItemID = items.ID;`, (err, vItemResult) => {
            if (err) {
                throw err;
            }
            let result = vItemResult.map(a => a.balance).some(v => v < 0);
            console.log(result);
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
        //             //     res.render('pages/index', { option: "outvouchers", error: "Item quantity is not enough" });
        //             // }
        //         });
        //     });
        // });


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