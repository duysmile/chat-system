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


exports.generateToken = (data) => {
    const token = jwt.sign(data, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60 });
    // const token = jwt.sign(data, privateKey, { expiresIn: 60 * 60 });
    return token;
};

exports.verifyToken = (token) => {
    const verifiedData = jwt.verify(token, publicKey);
    return verifiedData;
};
