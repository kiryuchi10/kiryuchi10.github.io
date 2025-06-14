// /routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        await User.create({ username, password: hashed });
        res.json({ message: "User created" });
    } catch (err) {
        res.status(400).json({ error: "Username already taken" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
