require('dotenv').config();
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const express = require('express');
const sequelize = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/pages')));
app.use('/styles', express.static(path.join(__dirname, '../client/styles')));
app.use('/js', express.static(path.join(__dirname, '../client/js')));
app.use('/img', express.static(path.join(__dirname, '../client/img')));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during database setup:', error);
    });
