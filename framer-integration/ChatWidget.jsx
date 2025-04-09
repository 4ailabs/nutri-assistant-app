import { useEffect, useState } from "react";

// URL de la API desplegada en Railway
const API_URL = "https://web-production-91232.up.railway.app";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente nutricional. ¿En qué puedo ayudarte hoy?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    goals: "",
    dietaryRestrictions: "",
    allergies: ""
  });
  const [showProfile, setShowProfile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Función para enviar mensajes a la API
  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/nutrition-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          userInfo
        })
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error:", error);
      return "Lo siento, ha ocurrido un error al procesar tu solicitud.";
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

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
  };

  const updateUserInfo = (newInfo) => {
    setUserInfo({ ...userInfo, ...newInfo });
    setShowProfile(false);
  };

  // Desplazarse al final de los mensajes
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`fixed bottom-6 right-6 transition-all duration-300 ease-in-out shadow-2xl z-50 ${isExpanded ? 'w-80 h-[500px]' : 'w-16 h-16'}`} style={{maxHeight: '80vh'}}>
      {isExpanded ? (
        <div className="flex flex-col h-full bg-white overflow-hidden rounded-2xl border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 flex justify-between items-center shadow-md">
            <h2 className="text-lg font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Asistente Nutricional
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={toggleProfile}
                className="text-white hover:text-blue-100 transition-colors focus:outline-none"
                title="Mi Perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                onClick={toggleChat}
                className="text-white hover:text-blue-100 transition-colors focus:outline-none"
                title="Minimizar chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat o Perfil */}
          <div className="flex-grow overflow-hidden relative">
            {showProfile ? (
              /* Perfil del Usuario */
              <div className="p-4 h-full overflow-y-auto bg-gray-50">
                <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil Nutricional
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateUserInfo(userInfo);
                }}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Edad</label>
                      <input
                        type="number"
                        value={userInfo.age}
                        onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Género</label>
                      <select
                        value={userInfo.gender}
                        onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      >
                        <option value="">Seleccionar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                        <input
                          type="number"
                          value={userInfo.weight}
                          onChange={(e) => setUserInfo({...userInfo, weight: e.target.value})}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                        <input
                          type="number"
                          value={userInfo.height}
                          onChange={(e) => setUserInfo({...userInfo, height: e.target.value})}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Objetivos</label>
                      <textarea
                        value={userInfo.goals}
                        onChange={(e) => setUserInfo({...userInfo, goals: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        rows="2"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Restricciones dietéticas</label>
                      <textarea
                        value={userInfo.dietaryRestrictions}
                        onChange={(e) => setUserInfo({...userInfo, dietaryRestrictions: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        rows="2"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Alergias</label>
                      <textarea
                        value={userInfo.allergies}
                        onChange={(e) => setUserInfo({...userInfo, allergies: e.target.value})}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        rows="2"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Guardar Perfil
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Interfaz de Chat */
              <div className="flex flex-col h-full">
                <div id="chat-messages" className="flex-grow overflow-y-auto py-4 px-3 space-y-3 bg-gray-50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${
                        message.role === "user" 
                        ? "ml-auto" 
                        : "mr-auto"
                      } max-w-[85%]`}
                    >
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          message.role === "user" 
                          ? "bg-indigo-600 text-white rounded-tr-none" 
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        {message.content.split("\n").map((line, i) => (
                          <p key={i} className="mb-1 text-sm">{line}</p>
                        ))}
                      </div>
                      <div className={`text-xs mt-1 ${message.role === "user" ? "text-right text-gray-500" : "text-gray-500"}`}>
                        {message.role === "user" ? "Tú" : "Asistente"}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="mr-auto max-w-[85%]">
                      <div className="p-3 rounded-xl rounded-tl-none bg-white border border-gray-100 shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all duration-300">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow py-2 px-1 bg-transparent border-none focus:outline-none text-sm"
                      placeholder="Escribe tu pregunta..."
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className={`ml-2 p-2 rounded-full ${isLoading || !input.trim() ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-100'} transition-colors focus:outline-none`}
                      disabled={isLoading || !input.trim()}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Botón flotante cuando está minimizado
        <button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}