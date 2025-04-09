import { useState, useEffect } from "react";

// URL de la API desplegada en Railway
const API_URL = "https://web-production-91232.up.railway.app";

export default function SimpleChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola, soy tu asistente nutricional. ¿En qué puedo ayudarte hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Función para enviar mensajes a la API
  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      console.log("Enviando solicitud a:", `${API_URL}/api/nutrition-advice`);
      
      const response = await fetch(`${API_URL}/api/nutrition-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({
          message,
          userInfo: {} // Versión simple sin perfil de usuario
        }),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error:", error);
      // Mostrar más detalles del error
      try {
        if (error.response) {
          return `Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
        } else {
          return `Error: ${error.message || 'Desconocido'}`;
        }
      } catch (e) {
        return `Error al procesar la solicitud: ${error.message || 'Desconocido'}`;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Añadir mensaje del usuario
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input }
    ]);
    
    const userMessage = input;
    setInput("");
    
    // Obtener respuesta de la API
    const response = await sendMessage(userMessage);
    
    // Añadir respuesta del asistente
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response }
    ]);
  };

  // Desplazarse al final de los mensajes
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header simple */}
      <div className="bg-blue-600 text-white p-2 text-center">
        <h2 className="text-base font-medium">Asistente Nutricional</h2>
      </div>
      
      {/* Chat */}
      <div id="chat-messages" className="flex-grow overflow-y-auto p-3 bg-gray-50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 ${message.role === "user" ? "text-right" : ""}`}
          >
            <div 
              className={`inline-block p-2 rounded-lg max-w-[85%] ${
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
          <div className="mb-3">
            <div className="inline-block p-2 rounded-lg bg-white border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input simple */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-2 py-1 border border-gray-300 rounded-l"
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded-r"
            disabled={isLoading || !input.trim()}
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}