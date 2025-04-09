import { useState, useEffect, useRef } from "react";

// URL de la aplicación desplegada en Vercel
const API_URL = "https://nutri-assistant-app.vercel.app";

export default function FramerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "¡Hola! Soy tu asistente nutricional. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre alimentos saludables, recomendaciones dietéticas o cualquier duda nutricional que tengas." 
    }
  ]);
  const [inputText, setInputText] = useState("");
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
  const [showProfileForm, setShowProfileForm] = useState(false);
  const messageEndRef = useRef(null);

  // Cargar perfil de usuario almacenado
  useEffect(() => {
    const storedProfile = localStorage.getItem("nutritionProfile");
    if (storedProfile) {
      setUserInfo(JSON.parse(storedProfile));
    }
  }, []);

  // Efecto para scroll al último mensaje
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Función para guardar el perfil
  const saveProfile = () => {
    localStorage.setItem("nutritionProfile", JSON.stringify(userInfo));
    setShowProfileForm(false);
  };

  // Función para enviar un mensaje
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    // Añadir mensaje del usuario a la interfaz
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/nutrition-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          userInfo: userInfo
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
  
  // Función para manejar cambios en el perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mensajes de sugerencia para mejorar la experiencia de usuario
  const SUGGESTED_QUESTIONS = [
    "¿Qué alimentos son buenos para aumentar energía?",
    "¿Cómo puedo mejorar mi digestión naturalmente?",
    "¿Qué debería comer antes de entrenar?",
    "Dame un plan de comidas saludable para una semana"
  ];

  // Función para usar una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón de chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors focus:outline-none"
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
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 sm:h-[550px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium">Asistente Nutricional</h3>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="mr-2 text-white hover:text-green-100 focus:outline-none"
                title="Editar perfil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-100 focus:outline-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Información de perfil */}
          {userInfo.age && !showProfileForm && (
            <div className="bg-green-50 p-2 border-b border-green-100">
              <div className="flex flex-wrap items-center text-xs text-green-800">
                {userInfo.age && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 mr-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {userInfo.age} años
                  </span>
                )}
                {userInfo.weight && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 mr-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    {userInfo.weight} kg
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Formulario de perfil */}
          {showProfileForm && (
            <div className="p-3 bg-green-50 border-b border-green-100 overflow-y-auto">
              <h4 className="font-medium text-green-800 text-sm mb-2">Tu perfil nutricional</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs text-green-700 mb-1">Edad</label>
                  <input
                    type="number"
                    name="age"
                    value={userInfo.age}
                    onChange={handleProfileChange}
                    className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                    placeholder="Años"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-700 mb-1">Género</label>
                  <select
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleProfileChange}
                    className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                  >
                    <option value="">Seleccionar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-green-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={userInfo.weight}
                    onChange={handleProfileChange}
                    className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                    placeholder="Kg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-700 mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={userInfo.height}
                    onChange={handleProfileChange}
                    className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                    placeholder="Cm"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-xs text-green-700 mb-1">Objetivos</label>
                <input
                  type="text"
                  name="goals"
                  value={userInfo.goals}
                  onChange={handleProfileChange}
                  className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                  placeholder="Ej. Perder peso, ganar músculo"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-green-700 mb-1">Restricciones dietéticas</label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={userInfo.dietaryRestrictions}
                  onChange={handleProfileChange}
                  className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                  placeholder="Ej. Vegetariano, sin gluten"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-green-700 mb-1">Alergias</label>
                <input
                  type="text"
                  name="allergies"
                  value={userInfo.allergies}
                  onChange={handleProfileChange}
                  className="w-full px-2 py-1 text-sm border border-green-200 rounded"
                  placeholder="Ej. Nueces, mariscos"
                />
              </div>
              <button
                onClick={saveProfile}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-2 rounded transition-colors"
              >
                Guardar perfil
              </button>
            </div>
          )}
          
          {/* Mensajes */}
          {!showProfileForm && (
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
              
              {/* Sugerencias */}
              {messages.length <= 2 && !isLoading && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Sugerencias:</p>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(question)}
                        className="text-xs bg-white border border-gray-300 rounded-full px-2 py-1 text-gray-700 hover:bg-gray-100"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          )}
          
          {/* Input */}
          {!showProfileForm && (
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-green-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={`p-2 rounded-r-md ${
                    isLoading || !inputText.trim() 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  disabled={isLoading || !inputText.trim()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}