// server.js

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const Property = require('./models/Property');
const User = require('./models/User');
require('dotenv').config();

const propertiesRoute = require('./routes/properties');
const usersRoute = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api/properties', propertiesRoute);
app.use('/api/users', usersRoute);

// DB Sync and Start
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
