import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.REACT_APP_API_URL || 'https://nutri-assistant-app.vercel.app/api';

// Mensajes de sugerencia para mejorar la experiencia de usuario
const SUGGESTED_QUESTIONS = [
  "¿Qué alimentos son buenos para aumentar energía?",
  "¿Cómo puedo mejorar mi digestión naturalmente?",
  "¿Qué debería comer antes de entrenar?",
  "Dame un plan de comidas saludable para una semana"
];

const ChatInterface = ({ userInfo }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente nutricional. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre alimentos saludables, recomendaciones dietéticas o cualquier duda nutricional que tengas.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Función para desplazarse al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await axios.post(`${API_URL}/api/nutrition-advice`, {
        message: input,
        userInfo: userInfo
      });
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.'
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto border border-green-100">
      {/* Encabezado del chat con gradiente */}
      <div className="p-5 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Asistente Nutricional</h2>
            <p className="text-sm text-green-100 opacity-90">
              Nutrición personalizada a tu servicio
            </p>
          </div>
        </div>
      </div>
      
      {/* Panel de estado de usuario */}
      {userInfo.age && (
        <div className="bg-green-50 p-3 border-b border-green-100">
          <div className="flex flex-wrap items-center text-xs text-green-800">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 mr-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {userInfo.age} años
            </span>
            {userInfo.weight && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 mr-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                {userInfo.weight} kg
              </span>
            )}
            {userInfo.goals && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {userInfo.goals.length > 25 ? userInfo.goals.substring(0, 25) + "..." : userInfo.goals}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Contenedor de mensajes */}
      <div 
        ref={chatContainerRef}
        className="h-96 md:h-[500px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chat-message mb-4 ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex items-center mb-1 ml-1">
                <div className="bg-green-100 p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-700">Nutricionista</span>
              </div>
            )}
            
            {message.role === 'user' && (
              <div className="flex items-center justify-end mb-1 mr-1">
                <span className="text-xs font-medium text-blue-700">Tú</span>
                <div className="bg-blue-100 p-1 rounded-full ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            <div className={`rounded-2xl p-4 shadow-sm ${message.role === 'user' ? 'bg-blue-50 text-blue-900 ml-8' : 'bg-green-50 text-green-900 mr-8'}`}>
              <ReactMarkdown className="prose prose-sm max-w-none">{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-message mb-4 assistant-message">
            <div className="flex items-center mb-1 ml-1">
              <div className="bg-green-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-green-700">Nutricionista</span>
            </div>
            
            <div className="rounded-2xl p-4 shadow-sm bg-green-50 text-green-900 mr-8">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugerencias de preguntas */}
      {showSuggestions && messages.length < 3 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Escribe tu pregunta sobre nutrición..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-r-lg transition duration-300 shadow-sm disabled:bg-green-400 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
        
        {/* Información de funcionamiento */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Tu asistente nutricional usa IA para darte recomendaciones personalizadas
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;