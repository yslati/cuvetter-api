const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateAccessToken(companyId) {
    return jwt.sign({ companyId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
