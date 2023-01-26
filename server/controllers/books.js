require('dotenv').config();
const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');
const { tokenValidate } = require('../helpers/tokenValidate');
const { operator, bookParams, orderParams } = require('../helpers/searchOperators');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('author');

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchBooks = async (req, res) => {
    // Parameters from url query 
    let operatorParam = req.query.operator;
    let sortParam = req.query.sort;
    let orderParam = req.query.order;
    const nameParam = req.query.name;
    const authorParam = req.query.author;
    const yearParam = req.query.year;

    // If operator is not specified, set it to AND by default
    if (operatorParam === undefined) operatorParam = operator.AND;

    // If sort is not specified or param does not exist, set it to NAME by default
    if (!Object.values(bookParams).includes(sortParam) || sortParam === undefined) sortParam = bookParams.NAME;

    // If ascending parameter is not specified or is different than ASC or DESC
    if (orderParam === undefined || (orderParam !== orderParams.ASC && orderParam !== orderParams.DESC)) orderParam = orderParams.ASC;

    // console.log('Sort param is: ' + sortParam);
    // console.log('Order param is: ' + orderParam);

    try {
        // Search for author if parameter is provided
        let author = null;
        if (authorParam !== undefined && authorParam.length >= 3) {
            author = await Author.find({name: { $regex: authorParam, $options: 'i' }}, {_id: 1});
        }

        // Filter queries that are defined by user
        const queries = [
            (nameParam && nameParam.length >= 3) && { name: { $regex: nameParam, $options: 'i' } },
            (yearParam && yearParam.length >= 3) && { releaseDate: { $gte: `${yearParam}-01-01`, $lte: `${yearParam}-12-30` } },
            author && { author: { $in: author } }
        ].filter(query => query);

        // Init books
        let books = null;

        // If there are any parameters in the url
        if (queries.length > 0) {
            // If selected operator is OR
            if (operatorParam === operator.OR) {
                books = await Book.find({ $or: queries })
                    .populate('author')
                    .sort({ 
                        [sortParam]:orderParam === orderParams.ASC ? orderParams.ASC : orderParams.DESC
                    });
            } 

            // If selected operator is OR
            if (operatorParam === operator.AND) {
                books = await Book.find({ $and: queries })
                    .populate('author').sort({ [sortParam]: orderParam });
            } 
        } else {
            books = await Book.find().populate('author')
                .sort({ 
                    [sortParam]:orderParam === orderParams.ASC ? orderParams.ASC : orderParams.DESC
                });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBook = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findById(id).populate('author');

        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ error: "Book not found in the database." });
    }
};

const rentBooks = async (req, res) => {
    // Check if user has valid token
    let user = tokenValidate(req, process.env.jwt_key);
    if (!user.ok) return res.status(400).json({ error: 'User is not logged in.' });

    // Destruct values from request body
    const { books } = req.body;

    try {
        // Get current user from token
        const currentUser = await User.findOne({ username: user.data.username }).populate('rented.book');

        // Check if user has verified account
        if (!currentUser.status.verified) return res.status(400).json({ error: 'User is not verified by admin.' });

        // If books are not specified from the client side
        if(books === undefined || books === null || books?.length <= 0) return res.status(400).json({ error: 'Empty order is not valid.' });

        // Check if those books exists and has licences
        const booksFromDB = await Book.find({ _id: { $in: books }, licenceCount: { $gt: 0 } });
        if (books.length !== booksFromDB.length) return res.status(400).json({ error: 'User cannot rent non existing books or books without a licence.' });

        // Check if user has space to rent those books
        if ((6 - currentUser.rented.length) < books.length) return res.status(400).json({ error: 'User cannot rent more than 6 books.' });

        // Check if user already has those books
        const duplicates = currentUser.rented.filter(item => books.includes(item.book._id.toString()));
        if (duplicates.length > 0) return res.status(400).json({ error: 'User cannot rent book that is already rented.' });

        // Push new rented books
        booksFromDB.forEach(book => {
            currentUser.rented.push({ book: book, createdAt: Date.now() });

            // Decrement licences count
            book.licenceCount--;
        });

        // Save books with decremented licence count 
        await Promise.all(booksFromDB.map(book => book.save()));

        // Save user with new rented books
        await currentUser.save();
        res.status(201).json({ message: 'Books has been rented.', currentUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const returnBook = async (req, res) => {
    // Get id from parameters
    const id = req.params.id;

    // Check if user has valid token
    let user = tokenValidate(req, process.env.jwt_key);
    if (!user.ok) return res.status(400).json({ error: 'User is not logged in.' });

    try {
        // Get current user from token
        const currentUser = await User.findOne({ username: user.data.username }).populate('rented.book');

        // Check if user has verified account
        if (!currentUser.status.verified) return res.status(400).json({ error: 'User is not verified by admin.' });

        // Get requested book from DB
        const book = await Book.findById(id).populate('author');

        // Get this book's rent date
        const bookFromRented = currentUser.rented.filter(item => item.book._id.toString() === id);

        // Add returned book to history
        currentUser.history.push({
            name: book.name,
            author: book.author.name,
            rentedAt: bookFromRented[0].createdAt
        });

        // Return the book found by ID
        currentUser.rented = currentUser.rented.filter(item => item.book._id.toString() !== id);

        await currentUser.save();

        // Increment licences count
        book.licenceCount++;
        await book.save();

        res.status(201).json({ message: 'Books has been returned and added to the history.', currentUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getBooks,
    getBook,
    rentBooks,
    returnBook,
    searchBooks
}