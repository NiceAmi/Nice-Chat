const jwt = require('jsonwebtoken');
const usersModel = require('../Models/usersModel');
require('dotenv').config();

const getAllUsers = async (token) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let users = await usersModel.find({});
        if (users) {
            return users;
        } else {
            return "No users found";
        }
    }
    return [];
};

const getUserById = async (token, userId) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let user = await usersModel.findById(userId);
        if (user) {
            return user;
        } else {
            return "No user found";
        }
    }
};

const updateUser = async (token, userId, obj) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        try {
            await usersModel.findOneAndUpdate({ _id: userId }, obj);
            return "User updated successfully";
        } catch (error) {
            return error.message;
        }
    }
    console.log(validate);
}

const deleteUserById = async (token, userId) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        try {
            await usersModel.deleteOne({ _id: userId });
            return 'Deleted Successfully';
        } catch (error) {
            return 'Error in deleting user';
        }
    }
}

module.exports = {
    getUserById, updateUser, getAllUsers, deleteUserById
};