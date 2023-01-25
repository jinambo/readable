require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { createToken } = require('../helpers/tokenSign');
const { tokenValidate } = require('../helpers/tokenValidate');

// Get logged user
const getLoggedUser = async (req, res) => {
    let user = tokenValidate(req, process.env.jwt_key);
    if (!user.ok) return res.status(400).json({ error: 'User is not logged in.' });

    try {
        const currentUser = await User.findOne({ username: user.data.username }).populate('rented.book');

        res.status(200).json(currentUser);
    } catch(error) {
        res.status(400).json({ error: error });
    }
}

const getLoggedUserHistory = async (req, res) => {
    let user = tokenValidate(req, process.env.jwt_key);
    if (!user.ok) return res.status(400).json({ error: 'User is not logged in.' });

    try {
        const currentUser = await User.findOne({ username: user.data.username });

        res.status(200).json(currentUser.history);
    } catch(error) {
        res.status(400).json({ error: error });
    }
};

const editLoggedUser = async (req, res) => {
    let user = tokenValidate(req, process.env.jwt_key);
    if (!user.ok) return res.status(400).json({ error: 'User is not logged in.' });

    // Destruct values from request body
    const { name, lastname, number, address } = req.body;

    try {
        // Get current user from DB
        const currentUser = await User.findOne({ username: user.data.username }).populate('rented.book');

        // Set new values if are entered
        if (name) currentUser.name = name;
        if (lastname) currentUser.lastname = lastname;
        if (number) currentUser.number = number;
        if (address) currentUser.address = address;

        // Set verified to false, admin has to verify user now again
        currentUser.status.verified = false;

        await currentUser.save();
        res.status(200).json({ message: 'User has been edited.', currentUser });
    } catch (error) {
        res.status(400).json({ error: error });   
    }
};

// Login in user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username }).populate('rented.book');
        if (!user) return res.status(400).json({ error: 'User does not exist.' });

        // If user is banned
        if (user.status.banned) return res.status(400).json({ error: 'Your account is banned. Contact us for more information.' });

        // Compare passwords hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Inputed password is wrong.' });

        // Sign JWT
        const token = createToken(user, process.env.jwt_key);

        res.status(201).json({
            message: 'User has logged in.',
            user,
            token
        });

    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Register user
const register = async (req, res) => {
    const { username, password, confirmPassword, name, lastname, number, address } = req.body;

    try {
        // Check if user already exists
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: 'User already exists.' });

        // Compare passwords
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords are not same.' });

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create and store new user to the DB
        const newUser = new User({
            name,
            lastname,
            number,
            address,
            username,
            password: passwordHash
        });

        const userRes = await newUser.save();

        // Sign JWT
        const token = createToken({ id: userRes.id, username: userRes.username }, process.env.jwt_key);

        res.status(201).json({
            message: 'User has been created.',
            userRes,
            token
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    register,
    login,
    getLoggedUser,
    editLoggedUser,
    getLoggedUserHistory
}