const Author = require('../models/author');

// GET all authors
const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();

        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET one author
const getAuthor = async (req, res) => {
    const id = req.params.id;

    try {
        const author = await Author.findById(id);

        res.status(200).json(author);
    } catch (error) {
        res.status(404).json({ message: "Author not found in the database." });
    }
};

// POST author
const postAuthor = async (req, res) => {
    const { name, biography } = req.body;
    const author = new Author({ name, biography });

    try {
        const newAuthor = await author.save();

        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAuthors,
    getAuthor,
    postAuthor
}