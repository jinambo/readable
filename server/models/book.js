const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Author',
        required: true,
    },
    pagesCount: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    isVisible: {
        type: Boolean,
        required: true
    },
    licenceCount: {
        type: String,
        required: true
    }
    // TODO: add picture
    /*picture: {
        data: Buffer,
        contentType: String,
    }*/
});

module.exports = mongoose.model('Book', bookSchema);