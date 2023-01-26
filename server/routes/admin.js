const express = require('express');
const router = express.Router();
const { register, login, createBook, editBook, deleteBook, verifyUser, banUser, createUser, editUser, deleteUserBook, getUsers, searchUsers, validateAdmin, exportDb, importDb } = require('../controllers/admin');
const multer  = require('multer')

// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })

// POST register - just for admin initialization
// router.post('/register', register);

// POST login user
router.post('/login', login);

// POST create book
router.post('/create-book', createBook);

// PATCH (update) book
router.patch('/edit-book/:id', editBook);

// PATCH verify user
router.patch('/verify-user/:id', verifyUser);

// PATCH ban user
router.patch('/ban-user/:id', banUser);

// DELETE book
router.delete('/delete-book/:id', deleteBook);

// GET all users
router.get('/users', getUsers);

// GET all users
router.get('/users/search', searchUsers);

// POST create user
router.post('/create-user', createUser);

// PATCH edit user
router.patch('/edit-user/:id', editUser);

// PATCH return user's rented book (remove from rented)
router.patch('/user/:user/delete-book/:book', deleteUserBook);

// GET validate admin
router.get('/validate', validateAdmin);

router.get('/export', exportDb);
router.post('/import', upload.single('importFile'), importDb);

module.exports = router;