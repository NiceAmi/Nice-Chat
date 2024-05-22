const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const router = express.Router();

router.get('/', async (req, res) => {
    let token = req.headers['x-access-token'];
    let response = await usersBLL.getAllUsers(token);
        res.send(response);
});

router.get('/:userId', async (req, res) => {
    let token = req.headers['x-access-token'];
    let { userId } = req.params;
    let response = await usersBLL.getUserById(token, userId);
    res.send(response);
});

router.put('/:userId', async (req, res) => {
    let token = req.headers['x-access-token'];
    console.log(token);
    let {userId} = req.params
    let obj = req.body;
    let response = await usersBLL.updateUser(token, userId, obj);
    res.send(response);
})

router.delete('/:userId', async (req, res) => {
    let token = req.headers['x-access-token'];
    let { userId } = req.params;
    let response = await usersBLL.deleteUserById(token, userId);
    res.send(response);
});

module.exports = router;