import { useEffect, useState } from "react";

// Asegúrate de reemplazar con la URL de tu API en Railway
const API_URL = "https://tu-app-railway.up.railway.app";

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
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Asistente Nutricional</h2>
        <button 
          onClick={toggleProfile}
          className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded-md text-sm"
        >
          Mi Perfil
        </button>
      </div>
      
      {/* Chat o Perfil */}
      <div className="flex-grow overflow-hidden">
        {showProfile ? (
          /* Perfil del Usuario */
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-medium text-green-800 mb-4">Mi Perfil Nutricional</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateUserInfo(userInfo);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Edad</label>
                  <input
                    type="number"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({...userInfo, age: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Género</label>
                  <select
                    value={userInfo.gender}
                    onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                  <input
                    type="number"
                    value={userInfo.weight}
                    onChange={(e) => setUserInfo({...userInfo, weight: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                  <input
                    type="number"
                    value={userInfo.height}
                    onChange={(e) => setUserInfo({...userInfo, height: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Objetivos</label>
                  <textarea
                    value={userInfo.goals}
                    onChange={(e) => setUserInfo({...userInfo, goals: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restricciones dietéticas</label>
                  <textarea
                    value={userInfo.dietaryRestrictions}
                    onChange={(e) => setUserInfo({...userInfo, dietaryRestrictions: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alergias</label>
                  <textarea
                    value={userInfo.allergies}
                    onChange={(e) => setUserInfo({...userInfo, allergies: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="2"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Interfaz de Chat */
          <div className="flex flex-col h-full">
            <div id="chat-messages" className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === "user" 
                    ? "bg-green-100 ml-12 text-right" 
                    : "bg-white mr-12 border border-gray-200"
                  }`}
                >
                  {message.content.split("\n").map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </div>
              ))}
              
              {isLoading && (
                <div className="p-3 rounded-lg bg-white mr-12 border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.4s"}}></div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="border-t p-4">
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
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-r-md transition duration-300 disabled:bg-green-400"
                  disabled={isLoading || !input.trim()}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}