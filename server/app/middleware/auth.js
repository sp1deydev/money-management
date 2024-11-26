const jwt = require('jsonwebtoken');
const _const = require('../config/constants');

module.exports = {
    checkLogin: (req, res, next) => {
        let token = req.cookies.jwt_token;
        if (!token) {
            token = req.headers['authorization'].split(' ')[1];
        }
        if (token) {
            jwt.verify(token, _const.JWT_ACCESS_KEY, (err, result) => {
                if(err) {
                    res.status(401).json({message: err});
                }
                else {
                    console.log(result);
                    req.userId = result.id;
                    req.role = result.role;
                    next();
                }
            })
        }
        else {
            res.status(401).json({message: 'access denied'});
        }
    },
}