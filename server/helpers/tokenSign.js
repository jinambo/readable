const jwt = require('jsonwebtoken');

// Create Access Token
const createToken = (user, key) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
    }, key, { expiresIn: '6d' })
};

module.exports = {
    createToken
};