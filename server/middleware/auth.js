const express = require("express");
const jwt = require('jsonwebtoken');
const {secretKey} = require('../util/jwtConfig');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
const auth = async (req, res, next) => {
    let token;
    if (req.path === "/auth/login") {
        return next();
    }
    
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer: ')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, secretKey, { algorithms: ["HS512"] });
            // console.log(token);
            // req.user = await User.findById(decoded.id).select('-password');
            res.locals.token = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = {
    auth
}