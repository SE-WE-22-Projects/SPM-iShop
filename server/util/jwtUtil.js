const jwt = require('jsonwebtoken');
const {secretKey} = require('./jwtConfig');

/**
 * used to create JWT 
 * @param {number} id 
 * @param {string} email 
 * @param {string} role 
 * @returns 
 */
const generateToken = (id,username,email,role)=>{
    const payload = {
        id,
        username,
        email,
        role,
    };
    return jwt.sign(payload,secretKey,{expiresIn: "3h", algorithm: 'HS512'});
}

module.exports = {
    generateToken
}