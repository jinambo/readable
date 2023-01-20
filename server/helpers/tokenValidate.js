const jwt = require('jsonwebtoken');

// Check if user is logged in, return token's data
const tokenValidate = (req, key) => {
    const auth = req.headers["authorization"];
    if (!auth) return { ok: false, data: null };

    try {
        if (auth) {
            const token = jwt.verify(
                auth.split('Bearer ')[1],
                key
            );

            return { ok: true, data: token };
        }
    } catch (e) {
        console.log('Error: ' + e);
        return { ok: false, data: null };
    }
};

module.exports = {
    tokenValidate
}