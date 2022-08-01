const express = require('express');
const ivouchers = express.Router();
const db = require('../dbConnection');


ivouchers.get('/new', (req, res) => {
    db.query(`SELECT * FROM items`, (err, itemRowResult) => {
        // console.log(itemRowResult);
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
                res.render('pages/index', { option: "newIV", itemRows: itemRowResult, schemeRows: schemesResult, stationRows: stationsResult });
                // res.send('hi')
            })
        })
    })
})


//OPTIMIZABLE
ivouchers.get('/', (req, res) => {
    db.query(`SELECT issuedvouchers.ID as IVID, IVNo, IVYear, stations.Name as stationName, SNo, schemes.Name as schemeName, users.Name as userName, DateOfReceival, Approval, ApprovalDate, ApprovedBy FROM issuedvouchers INNER JOIN stations ON issuedvouchers.Receiver = stations.ID INNER JOIN schemes ON schemes.ID = issuedvouchers.Scheme INNER JOIN users ON users.ID = issuedvouchers.ApprovedBy;`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items;`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT ivID, items.Name as Name, stations.Name as stationName, ivQtyReq, ivQtyPassed FROM issuedvouchers INNER JOIN ivitems ON issuedvouchers.ID = ivitems.ivID INNER JOIN items ON ivitems.ivItemID = items.ID INNER JOIN stations ON issuedvouchers.Receiver = stations.ID;`, (err, vItemResult) => {
                if (err) {
                    throw err;
                }
                console.log(vItemResult);
                let ivItemlist = {};
                vItemResult.forEach(row => {
                    if (!ivItemlist[row.ivID])
                        ivItemlist[row.ivID] = {};
                    ivItemlist[row.ivID][row.Name] = {
                        'req': row.ivQtyReq,
                        'passed': row.ivQtyPassed
                    }
                });
                // console.log(ivItemlist);
                res.render('pages/index', { option: "ivouchers", ivouchersData: result, itemRows: itemRowResult, ivItemlist: ivItemlist, error: null });
            });
        });
    });
});

ivouchers.post('/action/:Id/:user', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`SELECT * FROM ivitems INNER JOIN items where ivitems.ivID =${req.params.Id} and ivitems.ivItemID = items.ID`, (err, vItemResult) => {
            if (err) {
                throw err;
            }
            //loop result and update the quantity of the item in the inventory
            vItemResult.forEach(row => {
                db.query(`UPDATE items SET Quantity = Quantity - ${row.ivQtyPassed} WHERE ID = ${row.ID}`, (err, stockUpdateResult) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            );
            //update the status of the voucher to accepted
            db.query(`UPDATE issuedvouchers SET Approval = 1, ApprovedBy = ${req.params.user}, ApprovalDate = CURRENT_TIMESTAMP() WHERE ID = ${req.params.Id}`, (err, result) => {
                if (err) {
                    throw err;
                }
            }
            );
            res.redirect('/ivouchers');
        })
    } else {
        //db query to set approval to 2
        db.query(`UPDATE issuedvouchers SET Approval = 2, ApprovedBy = ${req.params.user}, ApprovalDate = CURRENT_TIMESTAMP() WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/ivouchers');
        }
        );

    }
})


ivouchers.post('/new', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    // console.log(addedJSON);
    db.query(
        `INSERT INTO issuedvouchers (IVNo, IVYear, Receiver, SNo, Scheme, DateOfReceival ) VALUES (${req.body.ivid}, ${req.body.ivyear}, ${req.body.stationid}, ${req.body.sno}, ${req.body.schemeid}, '${new Date(req.body.dor).toISOString().slice(0, 10)}')`,
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
                    db.query(`SELECT LAST_INSERT_ID() as lastID FROM issuedvouchers`, (err, lastVoucherResult) => {
                        if (err) {
                            throw err;
                        }
                        // console.log(lastVoucherResult);
                        db.query(`INSERT INTO ivitems (ivID, ivItemID, ivQtyReq, ivQtyPassed) VALUES (${lastVoucherResult[0].lastID}, ${itemNameIDResult[0].ID}, ${addedJSON[itemNameIDResult[0].Name].reqQty}, ${addedJSON[itemNameIDResult[0].Name].passedQty})`, (err, result) => {
                            if (err) {
                                throw err;
                            }
                        })
                    })
                })
            }
            res.redirect('/ivouchers');
        }
    );
})


ivouchers.get('/edit/:Id', (req, res) => {

    db.query(`SELECT * FROM issuedvouchers WHERE ID = ${req.params.Id}`, (err, result) => {

        if (err) {
            throw err;
        }
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
                    db.query(`SELECT * FROM ivitems INNER JOIN items ON ivitems.ivItemID = items.ID WHERE ivitems.ivID = ${req.params.Id}`, (err, ivItemResult) => {
                        if (err) {
                            throw err;
                        }


                        res.render('pages/index', { option: "editIV", result: result[0], itemRows: itemRowResult, ivItemlist: ivItemResult, schemeRows: schemesResult, stationRows: stationsResult, error: null });
                    }
                    );
                }
                );
            }
            );
        }
        );
    }
    );
}
);

ivouchers.post('/edit/:Id', (req, res) => {

    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(`UPDATE issuedvouchers SET IVNo = ${req.body.ivid}, IVYear = ${req.body.ivyear}, Receiver = ${req.body.stationid}, SNo = ${req.body.sno}, Scheme = ${req.body.schemeid}, DateOfReceival = '${new Date(req.body.dor).toISOString().slice(0, 10)}' WHERE ID = ${req.params.Id}`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`DELETE FROM ivitems WHERE ivID = ${req.params.Id}`, (err, result) => {
            if (err) {
                throw err;
            }

            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i]}'`, (err, itemNameIDResult) => {
                    if (err) {
                        throw err;
                    }

                    db.query(`INSERT INTO ivitems (ivID, ivItemID, ivQtyReq, ivQtyPassed) VALUES (${req.params.Id}, ${itemNameIDResult[0].ID}, ${addedJSON[itemNameIDResult[0].Name].reqQty}, ${addedJSON[itemNameIDResult[0].Name].passedQty})`, (err, result) => {

                        if (err) {
                            throw err;
                        }
                    })

                })
            }
            res.redirect('/ivouchers');
        }
        );
    }
    );
}
);

module.exports = ivouchers;



