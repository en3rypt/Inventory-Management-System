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
                res.locals.id = null;
                res.locals.user = null;
                res.locals.auth = null;
                next();
            } else {
                res.locals.id = decodedToken.id;
                res.locals.user = decodedToken.name;
                res.locals.auth = decodedToken.AuthType;
                next()
            }
        })
    } else {
        res.locals.id = null;
        res.locals.user = null;
        res.locals.auth = null;
        next();
    }
}

const authRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(res.locals.auth)) {
            return res.status(401).redirect('/')
        }
        next()

    }
}

module.exports = { requireAuth, checkUser, authRole }