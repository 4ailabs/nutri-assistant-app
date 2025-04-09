import { useState, useEffect, useRef } from "react";

// Reemplazar con tu URL de backend desplegado
const API_URL = "https://tu-url-de-backend.vercel.app";

export default function FramerChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola, soy tu asistente nutricional. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState("");
  const messageEndRef = useRef(null);
  
  // Efecto para generar un ID de cliente único al montar el componente
  useEffect(() => {
    const storedClientId = localStorage.getItem("chatClientId");
    if (storedClientId) {
      setClientId(storedClientId);
    } else {
      const newClientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatClientId", newClientId);
      setClientId(newClientId);
    }
  }, []);
  
  // Efecto para scroll al último mensaje
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Función para inicializar el thread
  const initializeThread = async () => {
    if (!clientId) return;
    
    try {
      const response = await fetch(`${API_URL}/api/thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ clientId })
      });
      
      if (!response.ok) {
        throw new Error("Error al inicializar el chat");
      }
      
      const data = await response.json();
      console.log("Thread inicializado:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Inicializar el thread cuando se tenga un clientId
  useEffect(() => {
    if (clientId) {
      initializeThread();
    }
  }, [clientId]);
  
  // Función para enviar un mensaje
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !clientId) return;
    
    // Añadir mensaje del usuario a la interfaz
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clientId,
          message: userMessage
        })
      });
      
      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }
      
      const data = await response.json();
      
      // Añadir respuesta del asistente
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.response || "Lo siento, no pude procesar tu solicitud." 
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, ocurrió un error. Por favor, intenta de nuevo más tarde." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };
  
  // Manejar tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón de chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors focus:outline-none"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.18 19.736 8 19.3L3 20L4.3 15.9C3.54 14.9 3 13.7 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      
      {/* Ventana de chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Cabecera */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Asistente Nutricional</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.role === "user" ? "text-right" : ""}`}
              >
                <div 
                  className={`inline-block p-2 rounded-lg max-w-[85%] ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-3">
                <div className="inline-block p-2 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75" />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messageEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`p-2 rounded-r-md ${
                  isLoading || !inputText.trim() 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isLoading || !inputText.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}