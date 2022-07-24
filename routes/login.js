
const express = require('express');
const router = express.Router();
const db = require('../dbConnection');
const { signupValidation, loginValidation } = require('../validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    const token = req.cookies.access_token;
    if (token) {
        jwt.verify(token, 'the-super-strong-secrect', (err, decodedToken) => {
            if (err) {
                res.redirect('/login')
            } else {
                res.redirect('/')
            }
        })
    } else {
        // res.redirect('/login')
        res.render('pages/login', { error: false });
    }
})

router.post('/', loginValidation, (req, res, next) => {
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
                        const token = jwt.sign(payload, 'the-super-strong-secrect', { expiresIn: '1d' });
                        // console.log(token);
                        return res.cookie("access_token", token, {
                            httpOnly: true,
                            maxAge: 86400000,
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

// router.get('/logout', (req, res) => {
//     res.clearCookie('access_token').redirect('/login');
// })



module.exports = router;