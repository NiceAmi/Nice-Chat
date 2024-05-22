import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Styles/chatRoom.css';
import { SendComp } from './Send';

export const ChatRoomComp = () => {
  const userId = useSelector(state => state.userId);
  const selectedUser = useSelector(state => state.selectedUser);
  const selectedChat = useSelector(state => state.messages);
  const token = useSelector(state => state.token);
  const userName = useSelector(state => state.userName);
  const socket = io('http://localhost:5000');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const [prevSelectedUserId, setPrevSelectedUserId] = useState(null);

  useEffect(() => {
    if (selectedChat) {
      const filteredMessages = selectedChat.flatMap(chat => chat.content)
        .filter(msg =>
          (msg.sender_id === userId && msg.receiver_id === selectedUser.userId) ||
          (msg.sender_id === selectedUser.userId && msg.receiver_id === userId)
        );
      setMessages(filteredMessages);

      if (selectedUser && selectedUser.userId !== prevSelectedUserId) {
        setAllMessagesLoaded(false);
      }

      if (allMessagesLoaded) {
        setDisplayedMessages(filteredMessages);
      } else {
        setDisplayedMessages(filteredMessages.slice(-10));
      }
    }
  }, [selectedChat, userId, selectedUser, allMessagesLoaded]);

  useEffect(() => {
    if (selectedUser) {
      setPrevSelectedUserId(selectedUser.userId);
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.emit('join-room', userId);
    socket.on('nodeEvent', (newMessage) => {
      if (newMessage.receiver_id === userId) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setDisplayedMessages(prevMessages => {
          const updatedMessages = [...prevMessages, newMessage];
          return updatedMessages.slice(-10);
        });
        dispatch({ type: 'SAVE_MESSAGES', payload: { newMessage } });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, userId, dispatch]);

  useEffect(() => {
    const cleanupFunction = async () => {
      if ((token && selectedUser && messages.length > 0) && (prevSelectedUserId !== selectedUser.userId)) {
        try {
          for (const message of messages) {
            await axios.post('http://localhost:5000/api/messages', { content: [message] }, {
              headers: {
                'x-access-token': token
              },
            });
          }
        } catch (error) {
          console.error('Error saving chat to DB:', error);
        }
      }
    };
  
    return cleanupFunction;
  }, [token, selectedUser, messages, prevSelectedUserId]);
  

  const handleScroll = (event) => {
    const scrollContainer = event.currentTarget;
    if (
      scrollContainer === messageContainerRef.current &&
      scrollContainer.scrollTop === 0 &&
      messages.length > 10 &&
      !allMessagesLoaded
    ) {
      setShowLoadMoreButton(true);
    } else {
      setShowLoadMoreButton(false);
    }
  };

  const loadAllMessages = () => {
    setDisplayedMessages(messages);
    setShowLoadMoreButton(false);
    setAllMessagesLoaded(true);
  };

  const handleLogout = async () => {
    try {
      for (const message of messages) {
        await axios.post('http://localhost:5000/api/messages', { content: [message] }, {
          headers: {
            'x-access-token': token
          },
        });
      }
      setAllMessagesLoaded(false);
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error saving chat:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      const lastMessage = messageContainer.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      } else {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className='chatWindow'>
      <div className='chatContent'>
        <div className='messageContainer' ref={messageContainerRef} onScroll={handleScroll}>
          {showLoadMoreButton && (
            <div className="load-more-button">
              <button onClick={loadAllMessages}>Load all Messages . . ?</button>
            </div>
          )}
          {displayedMessages.map((msg, index) => (
            <div
              className={`txt ${msg.sender_id !== userId ? 'receiver' : 'sender'}`}
              key={index}>
              <p>
                <span style={{ fontWeight: 'bold' }}>{msg.sender_name}</span>: {msg.message}<br />
                <span style={{ fontSize: '12px' }}>{msg.time}</span>
              </p>
            </div>
          ))}
        </div>
        <div className='inputContainer'>
          <SendComp
            userId={userId}
            selectedUser={selectedUser}
            userName={userName}
            socket={socket}
            dispatch={dispatch}
          />
        </div>
      </div>
      <button id='out' onClick={handleLogout}>Log Out</button>
    </div>
  );
};