const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const usersModel = require('../Models/usersModel')

const registerUser = async (obj) => {
  let { userName, password } = obj;
  let validate = await usersModel.find({ userName: userName });
  if (validate.length == 0) {
    validate = await usersModel.find({ password: password });
  }
  validate = validate[0];
  if (!validate) {
    let { password } = obj;
    let encryptedPassword = await bcrypt.hash(password + process.env.SECRET_KEY_PASSWORD, 10);
    obj.password = encryptedPassword;
    let user = new usersModel(obj);
    await user.save()
    return "User created successfully";
  } else {
    return "User name already exists, please register with another User name.";
  }
}

const logInUser = async (obj, req) => {
  try {
    const { userName, password } = obj;
    const user = await usersModel.findOne({ userName: userName });
    if (!user) {
      return "User not found";
    } else {
      const isPasswordValid = await bcrypt.compare(password + process.env.SECRET_KEY_PASSWORD, user.password);
      if (isPasswordValid) {
        req.session.userName = user.userName;
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.fullName = user.fullName;
        req.session.icon = user.icon;

        const token = jwt.sign({ ...obj, userId: user._id }, process.env.SECRET_TOKEN_KEY, { expiresIn: "3h" });

        return { token, userName: user.userName, user, icon: user.icon };
      } else {
        return "Invalid password";
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return "An error occurred while logging in";
  }
};

module.exports = { registerUser, logInUser };
