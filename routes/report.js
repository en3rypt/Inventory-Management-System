const express = require('express');
const report = express.Router();
const db = require('../dbConnection');

report.get('/',(req,res) => {
    res.render('pages/index',{option:'report'});
})

module.exports = report;