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
    db.query(`select count(*) from ivitems INNER JOIN issuedvouchers ON issuedvouchers.ID = ivitems.ivID WHERE WEEK(ApprovalDate) = WEEK(now());`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/month', (req, res) => {
    db.query(`select SUM(ivitems.ivQtyReq) from items inner join ivitems on items.ID=ivitems.ivItemID inner join issuedvouchers on ivitems.ivID=issuedvouchers.ID WHERE MONTH(issuedvouchers.DateOfCreation) = MONTH(CURRENT_DATE())
    AND YEAR(issuedvouchers.DateOfCreation) = YEAR(CURRENT_DATE())`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/year', (req, res) => {
    db.query(`select SUM(ivitems.ivQtyReq) from items inner join ivitems on items.ID=ivitems.ivItemID inner join issuedvouchers on ivitems.ivID=issuedvouchers.ID WHERE YEAR(issuedvouchers.DateOfCreation) = YEAR(CURRENT_DATE())`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})

charts.get('/ii/all', (req, res) => {
    db.query(`select SUM(ivitems.ivQtyReq) from items inner join ivitems on items.ID=ivitems.ivItemID inner join issuedvouchers on ivitems.ivID=issuedvouchers.ID`, (err, result) => {
        if (err) throw err;
        res.json(result);
    }
    )
})



module.exports = charts;