const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, required: true },
    price: { type: DataTypes.INTEGER, required: true },
    imageUrl: { type: DataTypes.STRING },
});

module.exports = Product;
