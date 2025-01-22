const User = require('../User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { findUserByEmailOrUsername, createUser, validatePassword } = require('../User');

router.post('/signup', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if ((!username && !email) || !password) {
            return res.status(400).json({ error: 'Please provide username/email and password' });
        }
        // Check if the user already exists
        const existingUser = await findUserByEmailOrUsername(email, username);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        // const oldUser = await User.findOne({ $or: [{email}, {username}]});
        // if (oldUser) {
        //     return res.status(400).json({error: 'User with this email or username already exists'});
        // }
        const user = new create({username, email, password})
        await user.save();
        res.status(201).json({message: 'Account created successfully'})
    }catch (err){
        res.status(400).json({error: err.message})
    }
});


// router.post('/login', async (req, res) => {
//     try {
//         const {username, email, password} = req.body;
//         if (!username || !email || !password) {
//             return res.status(400).json({ error: 'Please provide username, email, and password' });
//         }
//         const user = await User.findOne({$or:[{email}, {username}]});
//         if (!user) {
//             return res.status(400).json({ error: 'Account not found, try signing up' });
//         }
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(400).json({ error: 'Incorrect password' });
//         }

//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key', {
//             expiresIn: '1h',
//         });
//         res.json({token});
//     }catch (err) {
//         console.error('Login error:', err);
//         res.status(400).json({error: err.message})
//     }
// })

// module.exports = router;

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }

        // Validate credentials
        const user = await validatePassword(email, password);
        if (!user) {
            return res.status(400).json({ error: 'Incorrect email/username or password' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '1h',
        });

        res.json({ token });

    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;