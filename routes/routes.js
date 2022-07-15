
const express = require('express');
const router = express.Router();
const db = require('../dbConnection');
const { signupValidation, loginValidation } = require('../validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/login', (req, res) => {
    res.render('pages/login', { error: false });
})
router.get('/signup', (req, res) => {
    res.render('pages/signup');

})


router.post('/register', signupValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'This user is already in use!'
                });
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
                            `INSERT INTO users (name, email, password,AuthType) VALUES ('${req.body.name}', ${db.escape(
                                req.body.email
                            )}, ${db.escape(hash)},${AuthType})`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: 'The user has been registerd with us!'
                                });
                            }
                        );
                    }
                });
            }
        }
    );
});
router.post('/login', loginValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
        (err, result) => {

            // user does not exists
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: err
                });
            }
            if (!result.length) {
                return res.status(401).render('pages/login', { error: true });
            }
            // check password

            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    // wrong password
                    // console.log(bResult);
                    if (bErr) {
                        throw bErr;
                        return res.status(401).send({
                            msg: 'Email or password is incorrect!'
                        });
                    }
                    if (bResult) {
                        // console.log(result[0]['AuthType']);
                        var payload = {
                            name: result[0]['Name'],
                            AuthType: result[0]['AuthType']
                        }
                        const token = jwt.sign(payload, 'the-super-strong-secrect', { expiresIn: '1h' });
                        console.log(token);
                        return res.cookie("access_token", token, {
                            httpOnly: true,
                            maxAge: 360000,
                        }).status(200).redirect('/');
                    }
                    return res.status(401).send({
                        msg: 'Username or password is incorrect3!'
                    });
                }
            );
        }
    );
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token').redirect('/login');
})


router.post('/get-user', signupValidation, (req, res, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ) {
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    db.query('SELECT * FROM users where id=?', decoded.id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
    });
});
module.exports = router;
