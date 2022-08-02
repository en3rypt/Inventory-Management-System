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
    db.query(`SELECT receivedvouchers.ID as RVID, RVNo, RVYear, Supplier, SNo, schemes.Name as schemeName, users.Name as userName, DateOfReceival, Approval, ApprovalDate, ApprovedBy FROM receivedvouchers INNER JOIN schemes ON schemes.ID = receivedvouchers.Scheme INNER JOIN users ON users.ID = receivedvouchers.ApprovedBy;`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM receivedvouchers INNER JOIN rvitems ON receivedvouchers.ID = rvitems.rvID INNER JOIN items ON rvitems.rvItemID = items.ID;`, (err, rvItemResult) => {
                if (err) {
                    throw err;
                }
                let rvItemlist = {};
                rvItemResult.forEach(row => {
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
        `INSERT INTO receivedvouchers (RVNo, RVYear, Supplier, Scheme, SNo, DateOfReceival) VALUES (${req.body.rvid}, ${req.body.rvyear}, '${req.body.stationid}', ${req.body.schemeid}, ${req.body.sno}, '${new Date(req.body.dor).toISOString().slice(0, 10)}')`,
        (err, result) => {
            if (err) {
                throw err;
            }
            for (i = 0; i < Object.keys(addedJSON).length; i++) {
                db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i].replace(/"/g, '\\"').replace(/'/g, "\\'")}'`, (err, itemNameIDResult) => {
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

rvouchers.post('/action/:Id/:user', (req, res) => {
    var inputValue = req.body.action_type;
    if (inputValue == "Accept") {
        //compare the quantity of the item in the voucher with the quantity in the inventory
        db.query(`SELECT * FROM rvitems INNER JOIN items where rvitems.rvID =${req.params.Id} and rvitems.rvItemID = items.ID`, (err, vItemResult) => {
            if (err) {
                throw err;
            }
            //loop result and update the quantity of the item in the inventory
            vItemResult.forEach(row => {
                db.query(`UPDATE items SET Quantity = Quantity + ${row.rvItemQty} WHERE ID = ${row.ID}`, (err, stockUpdateResult) => {
                    if (err) {
                        throw err;
                    }
                });
            }
            );
            //update the status of the voucher to accepted
            db.query(`UPDATE receivedvouchers SET Approval = 1, ApprovedBy = ${req.params.user}, ApprovalDate = CURRENT_TIMESTAMP() WHERE ID = ${req.params.Id}`, (err, result) => {
                if (err) {
                    throw err;
                }
            }
            );
            res.redirect('/rvouchers');
        })
    } else {
        //db query to set approval to 2
        db.query(`UPDATE receivedvouchers SET Approval = 2, ApprovedBy = ${req.params.user}, ApprovalDate = CURRENT_TIMESTAMP() WHERE ID = ?`, [req.params.Id], (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/rvouchers');
        }
        );

    }
})


//receivedvouchers edit page
rvouchers.get('/edit/:Id', (req, res) => {
    db.query(`SELECT * FROM receivedvouchers WHERE ID = ${req.params.Id}`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM items`, (err, itemRowResult) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM rvitems INNER JOIN items ON rvitems.rvItemID = items.ID WHERE rvitems.rvID = ${req.params.Id}`, (err, rvItemResult) => {
                if (err) {
                    throw err;
                }


                // console.log(rvItemResult);
                // console.log(itemRowResult);
                db.query(`SELECT * FROM schemes`, (err, schemesResult) => {
                    if (err) {
                        throw err;
                    }
                    res.render('pages/index', { option: "editRV", result: result[0], itemRows: itemRowResult, rvItemlist: rvItemResult, schemeRows: schemesResult });
                })
            }
            );
        }
        );
    }
    );
}
);

//edit post request
rvouchers.post('/edit/:Id', (req, res) => {
    let addedJSON = JSON.parse(req.body.addedJSON);
    db.query(
        `UPDATE receivedvouchers SET RVNo = ${req.body.rvid}, RVYear = ${req.body.rvyear}, Supplier = '${req.body.stationid}', Scheme = ${req.body.schemeid}, SNo = ${req.body.sno}, DateOfReceival = '${new Date(req.body.dor).toISOString().slice(0, 10)}' WHERE ID = ${req.params.Id}`,
        (err, result) => {
            if (err) {
                throw err;
            }
            db.query(`DELETE FROM rvitems WHERE rvID = ${req.params.Id}`, (err, result) => {
                if (err) {
                    throw err;
                }
                for (i = 0; i < Object.keys(addedJSON).length; i++) {
                    db.query(`SELECT * FROM items WHERE Name = '${Object.keys(addedJSON)[i].replace(/"/g, '\\"').replace(/'/g, "\\'")}'`, (err, itemNameIDResult) => {
                        if (err) {
                            throw err;
                        }

                        db.query(`INSERT INTO rvitems (rvID, rvItemID, rvItemQty, rvItemRefNo, rvItemRefDate) VALUES (${req.params.Id}, ${itemNameIDResult[0].ID}, ${addedJSON[itemNameIDResult[0].Name].reqQty}, ${addedJSON[itemNameIDResult[0].Name].refNo}, '${new Date(addedJSON[itemNameIDResult[0].Name].refDate).toISOString().slice(0, 10)}')`, (err, result) => {
                            if (err) {
                                throw err;
                            }
                        }
                        )
                    }
                    );

                }
                res.redirect('/rvouchers');
            }
            );
        }
    );
}
);



module.exports = rvouchers;