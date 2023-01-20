const express = require('express');
const router = express.Router();
const { getAuthor, getAuthors, postAuthor } = require('../controllers/authors');


// GET all authors
router.get('/', getAuthors);

// GET one author
router.get('/:id', getAuthor);

// POST author
router.post('/', postAuthor);



module.exports = router;