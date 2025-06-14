// /models/Property.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Property = sequelize.define('Property', {
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    lon: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    school_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    crime_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Property;
