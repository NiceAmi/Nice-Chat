import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationComp } from './chatProject/Registration';
import { LoginComp } from './chatProject/Login';
import { NiceChatComp } from './chatProject/NiceChat';
import { FotterComp } from './chatProject/Footer';

function App() {
  const isLoggedIn = localStorage.getItem('userData') !== null;

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.clear();
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationComp />} />
        <Route path="/login" element={<LoginComp />} />
        <Route
          path="/niceChat"
          element={isLoggedIn ? <NiceChatComp /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chatRoom/:chatId"
          element={isLoggedIn ? <NiceChatComp /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <FotterComp />
    </Router>
  );
}

export default App;