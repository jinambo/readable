const express = require('express');
const router = express.Router();
const { register, login, getLoggedUser, editLoggedUser, getLoggedUserHistory, } = require('../controllers/users');

// GET logged user
router.get('/account', getLoggedUser);

// GET logged user's history
router.get('/history', getLoggedUserHistory);

// PATCH edit logged user
router.patch('/edit', editLoggedUser);

// POST new registered user
router.post('/register', register);

// POST login user
router.post('/login', login);


module.exports = router;