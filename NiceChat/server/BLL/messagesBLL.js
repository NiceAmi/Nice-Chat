const MessagesModel = require('../Models/messagesModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const getAllMessages = async (token) => {
  let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  if (validate) {
    try {
      return await MessagesModel.find({});
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  } else {
    return "messages not found"
  }
};

const getMessage = async (id, token) => {
  let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  if (validate) {
    try {
      return await MessagesModel.findOne({ _id: id });
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  } else {
    return "message not found"
  }
};


const saveMessage = async (data, token) => {
  let validate;
  let newData;

  if (typeof data === 'object' && data.token) {
    validate = jwt.verify(data.token, process.env.SECRET_TOKEN_KEY);
    newData = data.content;
  } else {
    validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    newData = data;
  }

  if (validate) {
    try {
      if (Array.isArray(newData)) {
        const savedMessages = await Promise.all(
          newData.map(async (data) => {
            const { content } = data;
            const newChatMessage = new MessagesModel({ content });
            return await newChatMessage.save();
          })
        );
        return savedMessages;
      } else {
        if (newData.hasOwnProperty('content')) {
          const { content } = newData;
          const newChatMessage = new MessagesModel({ content });
          return await newChatMessage.save();
        } else {
          const newChatMessage = new MessagesModel({ content: [newData] });
          return await newChatMessage.save();
        }
      }
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  } else {
    return "can not save message";
  }
};

const updateMessage = async (id, updatedData, token) => {
  let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  if (validate) {
    try {
      const updatedMessage = await MessagesModel.findByIdAndUpdate(id, updatedData, { new: true });
      return "Message updated successfully";
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  } else {
    return "can not update message"
  }
}

const deleteMessage = async (id, token) => {
  let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  if (validate) {
    try {
      const result = await MessagesModel.findByIdAndDelete(id);
      return "Message deleted successfully";
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  } else {
    return "can not delete message"
  }
};


module.exports = {
  getAllMessages,
  getMessage,
  saveMessage,
  updateMessage,
  deleteMessage,
};