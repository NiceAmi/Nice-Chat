const mongoose = require('mongoose');
require('dotenv').config();

const connectToDb = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to the database");
        })
        .catch(err => {
            console.error("Database connection error:", err);
        });
};

module.exports = connectToDb;
