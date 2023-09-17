const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env; // Define your secret key in the environment variables

function AuthenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Handle expired token here
                return res.status(401).json({ message: 'Access denied. Token has expired.' });
            } else {
                // Handle other JWT verification errors
                return res.status(403).json({ message: 'Access denied. Invalid token.' });
            }
        }

        req.user = user; // Store the user object for further use in the request
        next();
    });
};

module.exports = AuthenticateToken;
