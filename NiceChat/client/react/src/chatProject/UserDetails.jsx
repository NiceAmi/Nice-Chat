import React from 'react';
import { useSelector } from 'react-redux';
import '../Styles/userDetails.css';

export const UserDetailsComp = () => {
  const selectedUserName = useSelector(state => state.selectedUserName);
  const selectedUserIconURL = useSelector(state => state.icon);

  return (
    <div className="userDetails">
      <img src="../images/icon-chat.png" alt="logo" />
      <h2>Chatting with: <span style={{ fontSize: 'larger', color: '#f7e706' }}>{selectedUserName}</span></h2>
      {selectedUserIconURL && (
        <img src={selectedUserIconURL} alt="User Icon" style={{ marginRight: '10px' }}/>
      )}
    </div>
  );
};
