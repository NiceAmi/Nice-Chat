import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import '../App.css';

export const LoginComp = () => {
  const navigate = useNavigate();
  const URL = 'http://localhost:5000/api/auth/login';
  const [user, setUser] = useState({ userName: '', password: '' });
  const dispatch = useDispatch();

  const setUserDetails = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const login = async () => {
    if (!user.userName || !user.password) {
      alert('Please enter correct userName and password');
    } else {
      try {
        const { data } = await axios.post(URL, user);
        console.log('DATA:', data);
        if (typeof data === 'string') {
          alert(data);
        } else {
          const { token, userName, userId, icon } = data;
          dispatch({
            type: 'USER_LOGIN_SUCCESS',
            payload: { token, userName, userId, icon },
          });
          localStorage.clear();
          localStorage.setItem("userData", JSON.stringify(data));
          alert('User logged in successfully');
          navigate('/niceChat');
        }
      } catch (err) {
        console.error('Error logging in', err);
      }
    }
  };

  const register = () => {
    navigate('/');
  }

  return (
    <div>
      <div className='container'>
        <div className='headLine'>
          <h2>At NiceChat we believe that no one deserves to be alone and thanks to our technology,
            you will be able to connect with anyone in the world...</h2>
        </div>

        <div className='entry'>
          <h1>Welcome to NiceChat where you can relax and connect with the world</h1>
          <h1 id='regLog'>Login</h1>

          <div className='logInput'>
            <input type="text" placeholder="Type your user name..." onChange={setUserDetails} name="userName" /><br />
            <input type="password" placeholder="Type password..." onChange={setUserDetails} name="password" /><br />
          </div>

          <div className='btnLog'>
            <p>Please connect with the world...</p>
            <button id="etrBtn" onClick={login}>Login</button>
            <p> Have't a subscription yet, please register...</p>
            <button id="etrBtn" onClick={register}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};
