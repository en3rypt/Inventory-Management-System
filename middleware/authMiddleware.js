const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        jwt.verify(token, 'the-super-strong-secrect', (err, decodedToken) => {
            if (err) {
                res.redirect('/login')
            } else {
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
                res.locals.auth = null;
                next();
            } else {
                res.locals.user = decodedToken.name;
                res.locals.auth = decodedToken.AuthType;
                next()
            }
        })
    } else {
        res.locals.user = null;
        res.locals.auth = null;
        next();
    }
}

const authRole = (role) => {
    return (req, res, next) => {
        if (res.locals.auth !== role) {
            return res.status(401).redirect('/login')
        }
        next()

    }
}

module.exports = { requireAuth, checkUser, authRole }