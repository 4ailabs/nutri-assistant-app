import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatInterface = ({ userInfo }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente nutricional. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre alimentos saludables, recomendaciones dietéticas o cualquier duda nutricional que tengas.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para desplazarse al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 bg-green-50">
        <h2 className="text-xl font-semibold text-green-800">Asistente Nutricional</h2>
        <p className="text-sm text-gray-600">
          Haz preguntas sobre nutrición, dietas, recetas saludables y más
        </p>
      </div>
      
      <div className="h-96 md:h-[500px] overflow-y-auto p-4 bg-gray-50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-message assistant-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Escribe tu pregunta sobre nutrición..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-r-md transition duration-300 disabled:bg-green-400"
            disabled={isLoading || !input.trim()}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 5l7 7-7 7M5 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;