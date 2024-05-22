import React, { useState } from 'react';
import '../Styles/send.css';

export const SendComp = ({ userId, selectedUser, userName, socket, dispatch }) => {
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = async () => {
    if (userId && selectedUser && messageInput.trim() !== '') {
      try {
        $('#send-button').text('Sending...');
        const currentTime = new Date().toISOString();
        const newMessage = {
          sender_id: userId,
          receiver_id: selectedUser.userId,
          sender_name: userName,
          receiver_name: selectedUser.userName,
          time: currentTime,
          message: messageInput,
        };

        socket.emit('clientEvent', { senderId: userId, receiverId: selectedUser.userId, message: newMessage });

        dispatch({ type: 'SAVE_MESSAGES', payload: { newMessage } });
        setMessageInput('');

        setTimeout(() => {
          $('#send-button').text('Send');
        }, 750); 
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('userId, selectedUser, or messageInput is invalid');
    }
  };

  const handleMessageChange = (e) => {
    setMessageInput(e.target.value);
  };

  return (
    <div className="send">
      <div className="text">
        <input
          type="text"
          value={messageInput}
          onChange={handleMessageChange}
          id="send"
          placeholder="Enter Message..."/>
        <button id="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};