import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import '../Styles/chatList.css';

export const ChatListComp = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const userId = useSelector(state => state.userId);
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        if (token) {
          const messageResponse = await axios.get('http://localhost:5000/api/messages', { headers: { 'x-access-token': token } });
          const allMessages = messageResponse.data;
          const userMessages = allMessages.filter(message => message.content && (
            message.content.some(msg => msg && msg.receiver_id && msg.receiver_id.toString() === userId) ||
            message.content.some(msg => msg && msg.sender_id && msg.sender_id.toString() === userId)
          ));
          const chatsByUser = {};
          userMessages.forEach(message => {
            const otherUserId = message.content[0].sender_id.toString() === userId ? message.content[0].receiver_id.toString() : message.content[0].sender_id.toString();
            if (otherUserId !== userId) {
              if (!chatsByUser[otherUserId]) {
                chatsByUser[otherUserId] = [];
              }
              chatsByUser[otherUserId].push(message);
            }
          });
          const userListResponse = await axios.get('http://localhost:5000/api/users', { headers: { 'x-access-token': token } });
          const allUsers = userListResponse.data;
          const chatListData = allUsers
            .filter(user => user._id !== userId && user.userName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(user => ({
              userId: user._id,
              userName: user.userName,
              icon: user.icon,
              messages: chatsByUser[user._id.toString()] || []
            }));
          setChatList(chatListData);
        }
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };
    fetchChatList();
  }, [dispatch, token, userId, searchTerm]);

  const handleUserClick = async (selectedUser) => {
    if (selectedUserChat && selectedUserChat.userId === selectedUser.userId) {
      return;
    }
    dispatch({
      type: 'SELECTED_USER_CHAT',
      payload: {
        selectedUser,
        selectedChat: selectedUser.messages,
      },
    });
    setSelectedUserChat(selectedUser);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="chatList">
      <h1>Chat List</h1>
      <div className="srcBox">
        <input
          type="text"
          placeholder="Search user name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <ul>
        {chatList.map((user, index) => (
          <li key={index}>
            <Link
              to={`/chatRoom/${user.userId}`}
              onClick={() => handleUserClick(user)}
              className={onlineUsers.includes(user.userId) ? 'online' : ''}
            >
              {user.userName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
