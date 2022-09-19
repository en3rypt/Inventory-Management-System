
const express = require('express');
const router = express.Router();
const db = require('../dbConnection');
const { signupValidation, loginValidation } = require('../validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.render('pages/signup', { exists: false, success: false });

})


router.post('/', signupValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if (result.length) {
                return res.status(401).render('pages/signup', { exists: true, success: false });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        // has hashed pw => add to database
                        if (req.body.AuthType === '1') {
                            var AuthType = 1;
                        } else if (req.body.AuthType === '2') {
                            var AuthType = 2;
                        } else if (req.body.AuthType === '3') {
                            var AuthType = 3;
                        }

                        db.query(
                            `INSERT INTO users (name, username, password,AuthType) VALUES ('${req.body.name}', ${db.escape(
                                req.body.email
                            )}, ${db.escape(hash)},${AuthType})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).render('pages/signup', { exists: false, success: true });
                            }
                        );
                    }
                });
            }
        }
    );
});

module.exports = router;
