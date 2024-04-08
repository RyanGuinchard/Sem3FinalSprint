const express = require('express');
const bcrypt = require('bcrypt');
const userDAL = require('../services/userDAL');

const router = express.Router();

// Route to render the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Route to handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username and password are provided
        if (!username || !password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Retrieve the user from the database
        const user = await userDAL.getUserByUsername(username);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the password stored in the database
        if (password === user.password) {
            // res.status(200).json({ message: 'Login successful' });
            res.redirect('/')
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Route to log out
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/users/login');
    });
});


// Route to render the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { username, password, isAdmin } = req.body;

    try {
        // Create a new user
        const userId = await userDAL.createUser(username, password, isAdmin);

        res.status(201).json({ userId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

module.exports = router;
