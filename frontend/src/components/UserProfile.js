import React, { useState } from 'react';

// Opciones predefinidas para restricciones dietéticas
const DIETARY_OPTIONS = [
  { value: "vegetariano", label: "Vegetariano" },
  { value: "vegano", label: "Vegano" },
  { value: "sin_gluten", label: "Sin gluten" },
  { value: "sin_lactosa", label: "Sin lactosa" },
  { value: "keto", label: "Cetogénica" },
  { value: "paleo", label: "Paleo" },
  { value: "bajo_sodio", label: "Baja en sodio" },
  { value: "bajo_azucar", label: "Baja en azúcar" }
];

// Opciones predefinidas para objetivos
const GOAL_OPTIONS = [
  { value: "perder_peso", label: "Perder peso" },
  { value: "ganar_masa_muscular", label: "Ganar masa muscular" },
  { value: "mantener_peso", label: "Mantener peso" },
  { value: "mejorar_energia", label: "Mejorar energía" },
  { value: "mejorar_digestion", label: "Mejorar digestión" },
  { value: "control_diabetes", label: "Control de diabetes" },
  { value: "reducir_colesterol", label: "Reducir colesterol" },
  { value: "nutricion_deportiva", label: "Nutrición deportiva" }
];

const UserProfile = ({ userInfo, updateUserInfo }) => {
  const [formData, setFormData] = useState(userInfo);
  const [step, setStep] = useState(1);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convertir las selecciones múltiples a texto para el userInfo
    const updatedData = {
      ...formData
    };
    
    updateUserInfo(updatedData);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  
  const toggleDietOption = (value) => {
    // Si ya está seleccionada, quitarla
    if (selectedDiets.includes(value)) {
      setSelectedDiets(selectedDiets.filter(item => item !== value));
      setFormData({
        ...formData,
        dietaryRestrictions: selectedDiets.filter(item => item !== value).join(", ")
      });
    } else {
      // Si no está seleccionada, añadirla
      const newSelected = [...selectedDiets, value];
      setSelectedDiets(newSelected);
      setFormData({
        ...formData,
        dietaryRestrictions: newSelected.join(", ")
      });
    }
  };
  
  const toggleGoalOption = (value) => {
    if (selectedGoals.includes(value)) {
      setSelectedGoals(selectedGoals.filter(item => item !== value));
      setFormData({
        ...formData,
        goals: selectedGoals.filter(item => item !== value).join(", ")
      });
    } else {
      const newSelected = [...selectedGoals, value];
      setSelectedGoals(newSelected);
      setFormData({
        ...formData,
        goals: newSelected.join(", ")
      });
    }
  };

  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center mx-4">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepNumber 
                  ? "bg-green-600 text-white" 
                  : step > stepNumber 
                    ? "bg-green-100 text-green-800 border-2 border-green-600" 
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {stepNumber}
            </div>
            <span className={`text-xs mt-1 ${step === stepNumber ? "text-green-800 font-medium" : "text-gray-500"}`}>
              {stepNumber === 1 ? "Datos básicos" : stepNumber === 2 ? "Objetivos" : "Restricciones"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="slide-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Edad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              placeholder="Ej: 35"
              required
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero no decir">Prefiero no decir</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              placeholder="Ej: 70.5"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              name="height"
              id="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
              placeholder="Ej: 175"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <div></div> {/* Placeholder para alineación */}
          <button
            type="button"
            onClick={nextStep}
            disabled={!formData.age || !formData.gender}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="slide-in">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona tus objetivos nutricionales o de salud
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GOAL_OPTIONS.map((option) => (
              <div 
                key={option.value}
                onClick={() => toggleGoalOption(option.label)}
                className={`border p-3 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                  selectedGoals.includes(option.label) 
                    ? 'bg-green-100 border-green-500 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="goalsOther" className="block text-sm font-medium text-gray-700 mb-1">
            ¿Algún otro objetivo específico?
          </label>
          <textarea
            name="goals"
            id="goalsOther"
            value={formData.goals}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Describe otros objetivos específicos no incluidos en las opciones anteriores..."
          ></textarea>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
          
          <button
            type="button"
            onClick={nextStep}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="slide-in">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona tus restricciones dietéticas
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIETARY_OPTIONS.map((option) => (
              <div 
                key={option.value}
                onClick={() => toggleDietOption(option.label)}
                className={`border p-3 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                  selectedDiets.includes(option.label) 
                    ? 'bg-green-100 border-green-500 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="dietaryOther" className="block text-sm font-medium text-gray-700 mb-1">
            ¿Alguna otra restricción dietética?
          </label>
          <textarea
            name="dietaryRestrictions"
            id="dietaryOther"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Describe otras restricciones dietéticas específicas..."
          ></textarea>
        </div>
        
        <div className="mt-6">
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
            Alergias o intolerancias alimentarias
          </label>
          <textarea
            name="allergies"
            id="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
            placeholder="Ej: lácteos, frutos secos, mariscos, gluten..."
          ></textarea>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Atrás
          </button>
          
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Guardar Perfil
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto mt-8 border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-800">Mi Perfil Nutricional</h2>
          <p className="text-gray-600">
            Personaliza tus recomendaciones nutricionales
          </p>
        </div>
      </div>
      
      {renderStepIndicators()}
      
      <form onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
      
      <div className="mt-8 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500 text-center">
          Tus datos son confidenciales y solo se utilizan para personalizar tus recomendaciones nutricionales.
          No compartimos tu información con terceros.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;