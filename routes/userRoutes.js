const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const userDAL = require('../services/userDAL');

const router = express.Router();
app.locals.useMongoDB = false;

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

        let isMatch;
        // Check if the stored password is hashed
        if (user.password.startsWith('$2b$')) {
            // Compare the provided password with the hashed password
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Compare the provided password with the plaintext password
            isMatch = (password === user.password);
        }

        if (isMatch) {
            // res.status(200).json({ message: 'Login successful' });
            res.cookie('username', username, { maxAge: 900000, httpOnly: true });
            console.log(user.isadmin);
            res.cookie('isAdmin', user.isadmin, { maxAge: 900000, httpOnly: true });
            res.redirect('/')
            console.log(`${username} has logged in...`)
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
    console.log(`${req.cookies.username} has logged off.`)
    res.clearCookie('username');
    res.clearCookie('isAdmin');
    res.redirect('/users/login');
});

// Route to render the registration form
router.get('/register', (req, res) => {
    const isLoggedIn = req.cookies.username ? true : false;
    const isAdmin = req.cookies.isAdmin === 'true';
    const useMongoDB = app.locals.useMongoDB;
    res.render('register', { isLoggedIn, isAdmin, useMongoDB });
});

// Route to handle user registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    let { isAdmin } = req.body;

    // If isAdmin is undefined, set it to false
    if (isAdmin === undefined) {
        isAdmin = false;
    }

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
