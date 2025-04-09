import { useState, useEffect, useRef } from "react";

// URL de la API desplegada en Railway
const API_URL = "https://web-production-91232.up.railway.app";

export default function AssistantChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola, soy tu asistente nutricional. ¿En qué puedo ayudarte hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const chatContainerRef = useRef(null);
  
  // Iniciar una conversación al cargar el componente
  useEffect(() => {
    const startConversation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });
        
        if (!response.ok) {
          throw new Error("Error al iniciar la conversación");
        }
        
        const data = await response.json();
        setUserId(data.userId);
        console.log("Conversación iniciada con ID:", data.userId);
      } catch (error) {
        console.error("Error:", error);
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "Lo siento, tuve problemas para conectarme. Por favor, intenta recargar la página." 
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    startConversation();
  }, []);
  
  // Scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const sendMessage = async (messageText) => {
    if (!userId) {
      console.error("No hay ID de usuario establecido");
      return "Error: No se ha iniciado la conversación.";
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          message: messageText
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la respuesta del servidor");
      }
      
      const data = await response.json();
      return data.response || "No hay respuesta del asistente";
    } catch (error) {
      console.error("Error:", error);
      return `Lo siento, ha ocurrido un error: ${error.message}`;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput("");
    
    // Añadir mensaje del usuario al chat
    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage }
    ]);
    
    // Obtener respuesta
    const response = await sendMessage(userMessage);
    
    // Añadir respuesta del asistente
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: response }
    ]);
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-3 px-4">
        <h2 className="text-lg font-medium">Asistente Nutricional</h2>
      </div>
      
      {/* Chat window */}
      <div 
        ref={chatContainerRef} 
        className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading || !userId}
            className="flex-grow py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !userId}
            className={`px-4 py-2 rounded-lg text-white ${
              !input.trim() || isLoading || !userId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}