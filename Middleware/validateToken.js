const jwt = require('jsonwebtoken')
const User = require('../Models/UserModel')

const validateToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    // Split the token string by space and get the second part (index 1)
    const tokenParts = token.split(' ');
    const jwtToken = tokenParts[1];
    try {
        if (!jwtToken) {
            return res.status(401).json({ message: 'Unauthorized or Token is missing' });
        }
        const decoded = await jwt.verify(jwtToken, process.env.SECRETKEY);

        const user = await User.findById(decoded.userId);

        if (!user || user.accessToken !== jwtToken) {
            if (user.accessToken == null) {
                return res.status(401).json({ message: 'Please LogIn First' });
            }
            else {
                return res.status(401).json({ message: 'Invalid token or User is not in Database' });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ message: 'Invalid token or Token expired' });
    }
};

module.exports = { validateToken };
