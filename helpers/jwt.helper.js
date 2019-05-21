// import key
// sign
// verify.
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const privatePath = path.resolve(__dirname, '../configs/private.key');
const publicPath = path.resolve(__dirname, '../configs/public.key');
const privateKey = fs.readFileSync(privatePath, 'utf8');
const publicKey = fs.readFileSync(publicPath, 'utf8');


exports.generateToken = (data, options = {}) => {
    options = Object.assign({ 
        algorithm: 'RS256', 
        expiresIn: 60 * 60 
    }, options);
    const token = jwt.sign(data, privateKey, options);
    return token;
};

exports.verifyToken = (token, options= {}) => {
    const verifiedData = jwt.verify(token, publicKey, options);
    return verifiedData;
};
