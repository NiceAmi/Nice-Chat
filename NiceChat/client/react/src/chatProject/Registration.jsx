import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export const RegistrationComp = () => {
  const navigate = useNavigate();
  const URL = 'http://localhost:5000/api/auth/register';
  const [newUser, setNewUser] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    icon: ""
  });

  const createNewUser = async () => {
    if (
      !newUser.userName ||
      !newUser.fullName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confirmPassword ||
      !newUser.icon
    ) {
      alert("Please fill in all fields.");
    } else if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match. Please re-enter.");
    } else {
      try {
        const response = await axios.post(URL, newUser);
        if (response.data === "User created successfully") {
          alert("User Created");
          console.log(newUser);
          navigate('./login');
        } else {
          alert(response.data); 
        }
      } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred while registering. Please try again later.");
      }
    }
  };

  const handleIconChange = (e) => {
    const selectedIcon = e.target.value;
    setNewUser({ ...newUser, icon: selectedIcon });
  };

  return (
    <div>
      <div className='container'>
        <div className='headLine'>
          <h2>At NiceChat we believe that no one deserves to be alone and thanks to our technology,
            you will be able to connect with anyone in the world...</h2>
        </div>
        <div className='entry'>
          <h1>Welcome to NiceChat where you can relax and connect with the world</h1>
          <h1 id='regLog'>Registration</h1>
          <div className='RegInput'>
            <input type="text" placeholder="Type user name..." onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })} />
            <input type="text" placeholder="Type your full name..." onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
            <input type="text" placeholder="Type your Email..." onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input type="password" placeholder="Type password..." onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <input type="password" placeholder="Retype password..." onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
            <select onChange={handleIconChange}>
              <option value="">Select Icon...</option>
              <option value="https://cdn.pixabay.com/animation/2022/10/06/20/16/20-16-17-539_512.gif">Smiley</option>
              <option value="https://cdn.pixabay.com/animation/2024/02/16/20/47/20-47-57-984_512.gif">Davil</option>
              <option value="https://cdn.pixabay.com/animation/2022/08/14/08/59/08-59-59-366_512.gif">Cow</option>
              <option value="https://cdn.pixabay.com/animation/2023/05/03/22/06/22-06-28-156_512.gif">Sun</option>
              <option value="https://cdn.pixabay.com/animation/2024/04/12/20/41/20-41-46-381_512.gif">Eye</option>
              <option value="https://cdn.pixabay.com/animation/2023/05/28/13/22/13-22-30-666_512.gif">Moon</option>
              <option value="https://cdn.pixabay.com/animation/2023/05/22/20/17/20-17-27-433_512.gif">Earth</option>
              <option value="https://cdn.pixabay.com/animation/2023/05/16/20/22/20-22-42-620_512.gif">Pirate</option>
              <option value="https://cdn.pixabay.com/animation/2023/03/12/13/47/13-47-31-775_512.gif">Scery Man</option>
              <option value="https://cdn.pixabay.com/animation/2022/08/22/04/37/04-37-43-451_512.gif">Israel</option>
              <option value="https://cdn.pixabay.com/animation/2023/03/02/17/51/17-51-48-622_512.gif">Girl</option>
            </select>
            <div className='btn'>
              <p>Hello dear friend, please register <br />and join our global family</p>
              <button id="etrBtn" onClick={createNewUser}>Register</button>
              <p>Allreay register, please login...</p>
              <button id="etrBtn" onClick={() => navigate('./login')}>Login</button>
            </div>
          </div>
          <div className='Social'>
            <p>Keep in touch on all social networks</p>
            <img src="../images/facebook.png" alt="facebook" />
            <img src="../images/instagram.png" alt="instagram" />
            <img src="../images/linkedin.png" alt="linkedin" />
            <img src="../images/tik-tok.png" alt="tik-tok" />
            <img src="../images/twitter.png" alt="twitter" />
            <img src="../images/whatsapp.png" alt="whatsapp" />
            <img src="../images/youtube.png" alt="youtube" />
          </div>
        </div>
      </div>
    </div>
  );
};
