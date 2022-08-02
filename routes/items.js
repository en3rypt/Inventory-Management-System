const express = require('express');
const items = express.Router();
const db = require('../dbConnection');


items.get('/new', (req, res) => {
    db.query(`SELECT * FROM categories`, (err, categResult) => {
        if (err) {
            throw err;
        }
        res.render('pages/index', { option: "newItem", categs: categResult });
    });
})

items.get('/', (req, res) => {
    db.query(`SELECT * FROM items`, (err, result) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM categories`, (err, categResult) => {
            if (err) {
                throw err;
            }
            res.render('pages/index', { option: "items", itemsData: result, categs: categResult });
        });
    });
});



items.post('/new', (req, res) => {
    db.query(
        `INSERT INTO items (CategoryID, Name, Quantity, Life) VALUES ( ${req.body.categoryid}, '${req.body.itemname.replace(/"/g, '\\"').replace(/'/g, "\\'")}', ${req.body.itemquantity}, ${req.body.itemlife})`,
        (err, result) => {
            if (err) {
                throw err;
            }
            res.redirect('/items');
        }
    );
})



items.get('/edit/:id', (req, res) => {
    db.query(`SELECT * FROM items WHERE id = ${req.params.id}`, (err, result) => {
        if (err) throw err;
        db.query(`SELECT * FROM categories`, (err, categResult) => {
            if (err) throw err;
            res.render('pages/index', { option: 'editItem', result: result[0], categs: categResult, id: req.params.id });
        }
        )
    }
    )

})
items.post('/edit/:id', (req, res) => {
    var option = req.body.option;
    if (option == "Submit") {
        db.query(`UPDATE items SET CategoryID = ${req.body.categoryid}, Name = '${req.body.itemname.replace(/"/g, '\\"').replace(/'/g, "\\'")}', Life = ${req.body.itemlife} WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/items');
        }
        )
    }
    else if (option == "Delete") {
        db.query(`DELETE FROM items WHERE id = ${req.params.id}`, (err, result) => {
            if (err) throw err;
            res.redirect('/items');
        }
        )
    }


})

items.get('/history/:id', (req, res) => {
    db.query(`SELECT issuedvouchers.IVNo, issuedvouchers.IVYear, stations.Name as stationName, ivQtyPassed, ApprovalDate FROM items INNER JOIN ivitems ON items.ID = ivitems.ivItemID INNER JOIN issuedvouchers ON issuedvouchers.ID = ivitems.ivID INNER JOIN stations ON stations.ID = issuedvouchers.Receiver WHERE items.ID = ${req.params.id} AND issuedvouchers.Approval = 1`, (err, itemHistoryIVResult) => {
        if (err) throw err;
        //handling the case when no history is found
        db.query(`SELECT receivedvouchers.RVNo, receivedvouchers.RVYear, receivedvouchers.Supplier, rvItemQty, ApprovalDate FROM items INNER JOIN rvitems ON items.ID = rvitems.rvItemID INNER JOIN receivedvouchers ON receivedvouchers.ID = rvitems.rvID WHERE items.ID = ${req.params.id} AND receivedvouchers.Approval = 1`, (err, itemHistoryRVResult) => {
            if (err) throw err;
            db.query(`SELECT Name FROM items WHERE ID = ${req.params.id}`, (err, nameResult) => {
                if (err) throw err;
                res.render('pages/index', {
                    option: 'itemHistory', itemHistoryIVResult: itemHistoryIVResult, itemHistoryRVResult
                        : itemHistoryRVResult, itemName: nameResult[0].Name
                });
            });
        })
    });
})
module.exports = items;

