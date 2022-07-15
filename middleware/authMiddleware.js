const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        jwt.verify(token, 'the-super-strong-secrect', (err, decodedToken) => {
            if (err) {
                console.log(err.msg)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        jwt.verify(token, 'the-super-strong-secrect', (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                res.locals.user = decodedToken.name;
                next()
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser }