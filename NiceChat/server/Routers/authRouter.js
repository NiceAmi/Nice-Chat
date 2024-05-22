const express = require('express');
const router = express.Router();
const authBLL = require('../BLL/authBLL');

router.post('/login', async (req, res) => {
  let obj = req.body;
  let response = await authBLL.logInUser(obj, req);
  if (typeof response === 'string') {
    res.send(response);
  } else {
    res.json({ token: response.token, userName: response.userName, userId: response.user._id, icon: response.icon });
  }
});

router.post('/register', async (req, res) => {
  let obj = req.body;
  let response = await authBLL.registerUser(obj);
  res.send(response);
});

module.exports = router;