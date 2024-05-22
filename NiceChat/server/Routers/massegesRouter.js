const express = require('express');
const router = express.Router();
const messagesBLL = require('../BLL/messagesBLL');


router.get('/', async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    const messages = await messagesBLL.getAllMessages(token);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:id', async (req, res) => {
  let token = req.headers['x-access-token'];
  const { id } = req.params;
  try {
    const message = await messagesBLL.getMessage(id, token);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  let token = req.headers['x-access-token'];
  try {
    const newData = req.body; 
    const savedChat = await messagesBLL.saveMessage({ token, content: newData });
    res.status(201).json(savedChat);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Duplicate key error: Ignoring duplicate messages');
      res.status(200).json({ success: true, message: 'Duplicate messages ignored' });
    } else {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.put('/:id', async (req, res) => {
  let token = req.headers['x-access-token'];
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedMessage = await messagesBLL.updateMessage(id, updatedData, token);
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  let token = req.headers['x-access-token'];
  const { id } = req.params;
  try {
    const result = await messagesBLL.deleteMessage(id, token);
    res.json(result);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;