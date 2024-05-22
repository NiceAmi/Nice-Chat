const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    fullName: String,
    email: String,
    password: String,
    icon: String,
},
{
    versionKey: false
});

const usersModel = mongoose.model('user', userSchema, 'users');

module.exports = usersModel;
