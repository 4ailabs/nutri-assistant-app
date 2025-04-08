import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import UserProfile from './components/UserProfile';
import Header from './components/Header';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    goals: '',
    dietaryRestrictions: '',
    allergies: ''
  });
  
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const updateUserInfo = (newInfo) => {
    setUserInfo({ ...userInfo, ...newInfo });
    setShowProfile(false);
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header toggleProfile={toggleProfile} />
      
      <main className="container mx-auto px-4 py-8">
        {showProfile ? (
          <UserProfile userInfo={userInfo} updateUserInfo={updateUserInfo} />
        ) : (
          <ChatInterface userInfo={userInfo} />
        )}
      </main>
      
      <footer className="bg-green-800 text-white text-center py-4 mt-10">
        <p>© {new Date().getFullYear()} Asistente de Orientación Nutricional | Desarrollado por Miguel Ojeda</p>
      </footer>
    </div>
  );
}

export default App;