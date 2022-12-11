const express = require('express');
const charts = express.Router();
const db = require('../dbConnection');

charts.get('/iv/today', (req, res) => {
    db.query(`select approval,count(*) as count from issuedvouchers WHERE DATE(DateOfCreation) = CURDATE() group by approval`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})
charts.get('/iv/week', (req, res) => {
    db.query(`select approval,count(*) as count from issuedvouchers WHERE  YEARWEEK(DateOfCreation, 1) = YEARWEEK(CURDATE(), 1) group by approval 
    `, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    }
    )
})

charts.get('/iv/month', (req, res) => {
    db.query(`select approval,count(*) as count from issuedvouchers WHERE MONTH(DateOfCreation) = MONTH(CURRENT_DATE())
    AND YEAR(DateOfCreation) = YEAR(CURRENT_DATE()) group by approval `, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})
charts.get('/iv/year', (req, res) => {
    db.query(`select approval,count(*) as count from issuedvouchers WHERE YEAR(DateOfCreation) = YEAR(CURRENT_DATE()) group by approval 
    `, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})
charts.get('/iv/all', (req, res) => {
    db.query(`select approval,count(*) as count from issuedvouchers group by approval`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/rv', (req, res) => {
    db.query(`select approval,count(*) as count from receivedvouchers group by approval`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

//charts for items isssued
charts.get('/ii/week', (req, res) => {
    db.query(`SELECT DATE_FORMAT(Date(ApprovalDate),'%y-%m-%d') as date, SUM(ivitems.ivQtyPassed) as sum FROM
    ivitems INNER JOIN issuedvouchers ON ivitems.ivID = issuedvouchers.ID
    WHERE issuedvouchers.Approval = 1 AND DATE(ApprovalDate) > now() - INTERVAL 1 WEEK
    GROUP BY DATE(ApprovalDate); `, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/month', (req, res) => {
    db.query(`SELECT DATE_FORMAT(Date(ApprovalDate),'%y-%m-%d') as date, SUM(ivitems.ivQtyPassed) as sum FROM
    ivitems INNER JOIN issuedvouchers ON ivitems.ivID = issuedvouchers.ID
    WHERE issuedvouchers.Approval = 1 AND ApprovalDate > now() - INTERVAL 1 MONTH
    GROUP BY DAY(ApprovalDate); `, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/year', (req, res) => {
    db.query(`SELECT MONTH(ApprovalDate) as date, SUM(ivitems.ivQtyPassed) as sum FROM
    ivitems INNER JOIN issuedvouchers ON ivitems.ivID = issuedvouchers.ID
    WHERE issuedvouchers.Approval = 1 AND ApprovalDate > now() - INTERVAL 1 YEAR
    GROUP BY MONTH(ApprovalDate); `, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/all', (req, res) => {
    db.query(`SELECT YEAR(ApprovalDate) as date, SUM(ivitems.ivQtyPassed) as sum FROM
    ivitems INNER JOIN issuedvouchers ON ivitems.ivID = issuedvouchers.ID
    WHERE issuedvouchers.Approval = 1
    GROUP BY YEAR(ApprovalDate);`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

//danger stock for least 5 quantity
charts.get('/ds', (req, res) => {
    db.query(`SELECT * FROM items ORDER BY Quantity limit 5;`, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
})

//5 items with the lowest receival-issual ratio 
charts.get('/lri', (req, res) => {
    db.query(`SELECT items.Name, SUM(ivitems.ivQtyPassed) as outQty FROM items INNER JOIN ivitems ON items.ID = ivitems.ivItemID INNER JOIN issuedvouchers ON issuedvouchers.ID = ivitems.ivID WHERE issuedvouchers.Approval = 1 GROUP BY items.id;`, (err, iresult) => {
        if (err) throw err;
        // console.log(iresult);
        db.query(`SELECT items.Name, SUM(rvitems.rvItemQty) as inQty FROM items INNER JOIN rvitems ON items.ID = rvitems.rvItemID INNER JOIN receivedvouchers ON receivedvouchers.ID = rvitems.rvID WHERE receivedvouchers.Approval = 1 GROUP BY items.id;`, (err, rresult) => {
            if (err) throw err;
            // console.log(rresult);
            let inBoth = iresult.map(item => {
                let inItem = rresult.find(ritem => ritem.Name === item.Name);
                if (inItem) {
                    return {
                        Name: item.Name,
                        riRatio: parseInt(inItem.inQty) / parseInt(item.outQty),
                    }
                }
            })
            inBoth = inBoth.filter(function (element) {
                return element !== undefined;
            });
            res.json(inBoth);
        });
    });
});

module.exports = charts;