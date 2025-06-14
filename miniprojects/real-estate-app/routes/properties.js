// /routes/properties.js

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// Get all properties
router.get('/', async (req, res) => {
    const properties = await Property.findAll();
    res.json(properties);
});

// Insert new properties (admin import)
router.post('/import', async (req, res) => {
    try {
        await Property.bulkCreate(req.body.properties);
        res.json({ message: "Properties imported!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Import failed" });
    }
});

module.exports = router;
