import React, { useState, useEffect } from 'react';
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
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Cargar información de usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('nutriAssistantUserInfo');
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedInfo);
        
        // Verificar si el perfil tiene al menos edad y género
        if (parsedInfo.age && parsedInfo.gender) {
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    }
    
    // Ocultar la pantalla de bienvenida después de 3 segundos
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Si el perfil no está completo, mostrar la pantalla de perfil
      if (!isProfileComplete) {
        setShowProfile(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const updateUserInfo = (newInfo) => {
    const updatedInfo = { ...userInfo, ...newInfo };
    setUserInfo(updatedInfo);
    setShowProfile(false);
    
    // Guardar en localStorage
    localStorage.setItem('nutriAssistantUserInfo', JSON.stringify(updatedInfo));
    
    // Actualizar estado de completado
    if (updatedInfo.age && updatedInfo.gender) {
      setIsProfileComplete(true);
    }
  };

  // Pantalla de bienvenida
  if (showWelcome) {
    return (
      <div className="App min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="bg-white p-6 rounded-full inline-block mb-6 shadow-2xl animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Asistente Nutricional</h1>
          <p className="text-xl text-green-100">Tu guía personalizada para una alimentación saludable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header toggleProfile={toggleProfile} />
      
      <main className="container mx-auto px-4 py-8">
        {showProfile ? (
          <UserProfile userInfo={userInfo} updateUserInfo={updateUserInfo} />
        ) : (
          <ChatInterface userInfo={userInfo} />
        )}
        
        {/* Sección de información nutricional */}
        <section id="informacion" className="mt-16 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-800 mb-4 section-header">Información Nutricional</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-green-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Beneficios de una Alimentación Saludable</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mayor energía y vitalidad
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mejor control de peso
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Reducción del riesgo de enfermedades
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mejora del estado de ánimo
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">Cómo Usar Este Asistente</h3>
              <ol className="text-gray-700 space-y-2 list-decimal pl-5">
                <li>Completa tu perfil nutricional</li>
                <li>Haz preguntas específicas sobre nutrición</li>
                <li>Solicita planes de alimentación personalizados</li>
                <li>Pregunta sobre alimentos y sus beneficios</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white text-center py-6 mt-10 shadow-inner">
        <div className="container mx-auto px-4">
          <p className="mb-2">© {new Date().getFullYear()} Asistente de Orientación Nutricional</p>
          <p className="text-sm text-green-200">Desarrollado por Miguel Ojeda</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-green-200 hover:text-white transition-colors">
              Términos de uso
            </a>
            <span className="text-green-500">•</span>
            <a href="#" className="text-green-200 hover:text-white transition-colors">
              Política de privacidad
            </a>
            <span className="text-green-500">•</span>
            <a href="#" className="text-green-200 hover:text-white transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;