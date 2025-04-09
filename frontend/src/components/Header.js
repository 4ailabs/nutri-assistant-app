import React from 'react';

const Header = ({ toggleProfile }) => {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-green-600" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Asistente Nutricional</h1>
            <p className="text-xs text-green-100 hidden sm:block">Tu guía para una alimentación saludable</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a 
            href="#informacion" 
            className="text-green-100 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 hidden md:block"
          >
            Información
          </a>
          
          <button 
            onClick={toggleProfile}
            className="flex items-center bg-white text-green-700 hover:bg-green-50 py-2 px-4 rounded-lg shadow-md transition duration-300 font-medium"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            Mi Perfil
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;