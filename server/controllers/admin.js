require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');
const Book = require('../models/book');
const { createToken } = require('../helpers/tokenSign');
const { tokenValidate } = require('../helpers/tokenValidate');
const { operator, userParams } = require('../helpers/searchOperators');

// Get all users
const getUsers = async (req, res) => {
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    try {
        const users = await User.find().populate('rented.book');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search in users
const searchUsers = async (req, res) => {
    // Parameters from url query 
    let operatorParam = req.query.operator;
    let sortParam = req.query.sort;
    let orderParam = req.query.order;
    const nameParam = req.query.name;
    const lastnameParam = req.query.lastname;
    const addressParam = req.query.address;
    const numberParam = req.query.number;

    // Check if user is logged admin
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    // If operator is not specified, set it to AND by default
    if (operatorParam === undefined) operatorParam = operator.AND;

    // If sort is not specified or param does not exist, set it to NAME by default
    if (!Object.values(userParams).includes(sortParam) || sortParam === undefined) sortParam = userParams.LASTNAME;

    // If ascending parameter is not specified or is different than 1 or -1
    if (orderParam === undefined || (orderParam !== "1" && orderParam !== "-1")) orderParam = 1;

    try {
        // Filter queries that are defined by user and has more than 3 characters
        const queries = [
            nameParam && { name: { $regex: nameParam, $options: 'i' } },
            lastnameParam && { lastname: { $regex: lastnameParam, $options: 'i' } },
            addressParam && { address: { $regex: addressParam, $options: 'i' } },
            numberParam && { number: { $regex: numberParam, $options: 'i' } },
        ].filter(query => query !== undefined && query[Object.keys(query)[0]].$regex.length >= 3);

        // console.log('Queries: ' + JSON.stringify(queries));

        // Init users variable
        let users = null;

        // If there are any parameters in the url
        if (queries.length > 0) {
            // If selected operator is OR
            if (operatorParam === operator.OR) {
                users = await User.find({ $or: queries }).sort({ [sortParam]: orderParam });
            } 
            
            // If selected operator is AND
            if (operatorParam === operator.AND) {
                users = await User.find({ $and: queries }).sort({ [sortParam]: orderParam });
            } 
        } else {
            // If there are no parameters in the url
            users = await User.find().sort({ [sortParam]: orderParam });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify/unverify user
const verifyUser = async (req, res) => {
    const ID = req.params.id;

    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    const { verificationStatus } = req.body;
    
    try {
        // Get user to edit
        const user = await User.findById(ID);
        user.status.verified = verificationStatus === undefined ? true : verificationStatus;
        
        await user.save();
        res.status(201).json({ message: 'User has been updated.', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ban/unban user
const banUser = async (req, res) => {
    const ID = req.params.id;

    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });
    
    const { banStatus } = req.body;

    try {
        // Get user to edit
        const user = await User.findById(ID);
        user.status.banned = banStatus === undefined ? true : banStatus;
        
        await user.save();
        res.status(201).json({ message: 'User has been updated.', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });
    
    const { username, password, confirmPassword, name, lastname, number, address } = req.body;
    
    try {
        // Check if user already exists
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: 'User already exists.' });

        // Compare passwords
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords are not same.' });

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Set user status verified to true by default
        const status = { verified: true, banned: false };

        // Create and store new user to the DB
        const newUser = new User({
            name,
            lastname,
            number,
            address,
            username,
            password: passwordHash,
            status
        });

        const userRes = await newUser.save();

        // Sign JWT
        const token = createToken({ id: userRes.id, username: userRes.username }, process.env.jwt_key);

        res.status(201).json({
            message: 'User has been created by admin.',
            user: userRes,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const editUser = async (req, res) => {
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    // Get user id from params
    const ID = req.params.id;

    // Destruct values from request body
    const { name, lastname, number, address } = req.body;

    try {
        // Get user from DB by id
        const user = await User.findById(ID);

        // Set new values if are entered
        if (name) user.name = name;
        if (lastname) user.lastname = lastname;
        if (number) user.number = number;
        if (address) user.address = address;

        await user.save();
        res.status(200).json({ message: 'User has been edited.', user });
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

const deleteUserBook = async (req, res) => {
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    // Get user and book id from params
    const userID = req.params.user;
    const bookID = req.params.book;

    try {
        // Find the book for deletion
        const user = await User.findById(userID).populate('rented.book');
        const bookToDelete = user.rented.filter(item => item.book._id == bookID);

        // Get this book from DB - also catch error if the book does not exist
        const book = await Book.findById(bookToDelete[0].book).populate('author');

        // Check if user has this book rented
        if (bookToDelete.length <= 0) return res.status(404).json({ error: 'User does not have this book rented.' });

        // Add returned book to history
        user.history.push({
            name: book.name,
            author: book.author.name,
            rentedAt: bookToDelete[0].createdAt
        });

        // Delete the book from user.rented array
        const index = user.rented.indexOf(bookToDelete[0]);
        user.rented.splice(index, 1);

        await user.save();

        // Increment returned book
        book.licenceCount++;
        await book.save();

        res.status(200).json({ message: 'Book has been deleted and added to the history.', user });   
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

// Create new book
const createBook = async (req, res) => {
    const { name, description, author, pagesCount, isVisible, licenceCount, releaseDate } = req.body;

    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ message: 'You are not admin or not logged in.' });

    const book = new Book({
        name,
        description,
        author,
        pagesCount,
        releaseDate,
        isVisible,
        licenceCount
    });

    try {
        const newBook = await book.save();
        const populatedBook = await Book.findById(newBook._id).populate('author');

        res.status(201).json({ message: 'New book has been created.', book: populatedBook });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit book
const editBook = async (req, res) => {
    const ID = req.params.id;

    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });
    
    const { name, description, author, pagesCount, isVisible, licenceCount, releaseDate } = req.body;

    try {
        // Get book from the DB
        const book = await Book.findById(ID);

        // Set new values if are entered
        if (name) book.name = name;
        if (description) book.description = description;
        if (licenceCount) book.licenceCount = licenceCount;
        if (author) book.author = author;
        if (pagesCount) book.pagesCount = pagesCount;
        if (releaseDate) book.releaseDate = releaseDate;
        if (isVisible) book.isVisible = isVisible;

        // Save new book's values
        const editedBook = await book.save();
        const populatedBook = await Book.findById(editedBook._id).populate('author');

        res.status(200).json({ message: 'Book has been edited.', book: populatedBook });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    const ID = req.params.id;

    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'You are not admin or not logged in.' });

    try {
        // Check if the book is in any user's rented array
        const users = await User.find().populate('rented.book');
        const rentedBooks = users.map(user => user.rented).flat();
        const isRented = rentedBooks.some(rentedBook => rentedBook.book._id.equals(ID));

        if (isRented) return res.status(400).json({ error: 'The book is currently rented and cannot be deleted.' });

        // Delete the book
        await Book.findByIdAndDelete(ID);

        res.status(200).json({ message: 'Book has been deleted.', bookId: ID });
    } catch (error) {
        res.status(400).json({ error: error.message });   
    }
};

// Validate admin
const validateAdmin = async (req, res) => {
    let admin = tokenValidate(req, process.env.jwt_key_admin);
    if (!admin.ok) return res.status(400).json({ error: 'Token is not valid' });

    try {
        const currentAdmin = await Admin.findOne({ username: admin.data.username })

        res.status(200).json(currentAdmin);
    } catch(error) {
        res.status(400).json({ error: error });
    }
};

// Login admin
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: 'User does not exist.' });

        // Compare passwords hash
        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ error: 'Inputed password is wrong.' });

        // Sign JWT
        const token = createToken(admin, process.env.jwt_key_admin);

        res.status(201).json({
            message: 'User has logged in.',
            admin,
            token
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Register user
const register = async (req, res) => {
    const { name, lastname, username, password, confirmPassword } = req.body;

    try {
        // Check if user already exists
        const admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ error: 'User already exists.' });

        // Compare passwords
        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords are not same.' });

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create and store new user to the DB
        const newAdmin = new Admin({
            name,
            lastname,
            username,
            password: passwordHash
        });

        const adminRes = await newAdmin.save();

        // Sign JWT
        const token = createToken({ id: adminRes.id, username: adminRes.username }, process.env.jwt_key_admin);

        res.status(201).json({
            message: 'User has been created.',
            adminRes,
            token
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    validateAdmin,
    register,
    login,
    createBook,
    editBook,
    deleteBook,
    getUsers,
    searchUsers,
    verifyUser,
    banUser,
    createUser,
    editUser,
    deleteUserBook
}