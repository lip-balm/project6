const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const bodyParser= require('body-parser');
const path = require('path');

// connect to mongoDB
mongoose.connect('mongodb+srv://lipbalm:thatsrlycool@cluster0.qsoe9sy.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
  console.log('Successfully connected to MongoDB Atlas!');
})
.catch((error) => {
  console.log('Unable to connect to MongoDB Atlas!');
  console.error(error);
});

app.use(express.json());
app.use(bodyParser.json());

// prevent CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

app.use((req, res, next) => {
    res.json({message: "your request was successful"});
});

module.exports = app;