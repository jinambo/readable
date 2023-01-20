const express = require('express');
const router = express.Router();
const { getBooks, getBook, rentBooks, returnBook, searchBooks } = require('../controllers/books');

// GET all books
router.get('/', getBooks);

// GET search books
router.get('/search', searchBooks);

// GET one book
router.get('/:id', getBook);

// PATCH rent books
router.patch('/rent', rentBooks);

// PATCH return book
router.patch('/return/:id', returnBook);

module.exports = router;