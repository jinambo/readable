// Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// Connect mongoose to MongoDB Cluster
mongoose.connect(process.env.connection_string, {
    useNewUrlParser: true
});

// MongoDB connection logs
const db = mongoose.connection;
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to the MongoDB.'));

// Init express
const app = express();

// Setting allowed URLs
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Config express server
app.use(express.json());

// Apply routes
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);


// Listen to server on port
app.listen(4000, () => console.log('Server running on port 4000.'));
