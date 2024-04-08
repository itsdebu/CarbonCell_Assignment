const User = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const { signupValidator, loginValidator } = require('../Validators/user');
const jwt = require("jsonwebtoken")

const signup = async (req, res) => {

    // Joi validation
    const { error } = signupValidator.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.message
        })
    }
    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exist."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword
        })

        const user = await newUser.save();

        // Generating jwt token
        const tokenPayload = { userId: newUser._id, email: newUser.email };
        const accessToken = jwt.sign(tokenPayload, process.env.SECRETKEY, {
            expiresIn: '1h' //update it accordingly, currenlty token expiery time is 1hour
        });

        // Save accessToken to user model
        user.accessToken = accessToken;
        await user.save();

        return res.status(200).json({
            message: `User Registered Successfully with email: ${user.email}`,
            token: accessToken,
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}


const login = async (req, res) => {

    // Joi Validation
    const { error } = loginValidator.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.message
        });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User with this email does not exist",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        // Generating jwt token
        const tokenPayload = { userId: user._id, email: user.email };
        const accessToken = jwt.sign(tokenPayload, process.env.SECRETKEY, { expiresIn: '1h' });

        // Save accessToken to user model
        user.accessToken = accessToken;
        await user.save();

        return res.status(200).json({
            message: `LogIn Successfully with email: ${user.email}`,
            token: accessToken,
            success: true
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: `Something Wrong ${err}`
        });
    }
};

const logout = async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.user) {
            return res.status(401).json({ message: "User not logged in" });
        }

        // Remove accessToken from user model
        req.user.accessToken = null;
        await req.user.save();

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const checkLoggedIn = async (req, res) => {
    try {
        // Validate if user is logged in
        if (!req.user) {
            return res.status(401).json({ message: "User not logged in" });
        }

        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');

        res.status(200).json({ message: "User is logged in", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { signup, login, logout, checkLoggedIn }



