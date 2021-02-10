var jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config");

function verifyJWTToken(jwtToken)
{
    return jwt.verify(jwtToken, JWT_SECRET);
}

module.exports = verifyJWTToken; 