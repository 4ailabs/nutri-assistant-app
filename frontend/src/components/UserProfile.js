import React, { useState } from 'react';

const UserProfile = ({ userInfo, updateUserInfo }) => {
  const [formData, setFormData] = useState(userInfo);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserInfo(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Mi Perfil Nutricional</h2>
      <p className="text-gray-600 mb-6">
        Completa tu información para recibir recomendaciones nutricionales personalizadas.
        Esta información ayudará a nuestro asistente a ofrecerte consejos más precisos.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Edad
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ej: 35"
            />
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ej: 175"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
            Objetivos nutricionales/de salud
          </label>
          <textarea
            name="goals"
            id="goals"
            value={formData.goals}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: Perder peso, ganar masa muscular, mejorar energía, reducir colesterol..."
          ></textarea>
        </div>
        
        <div className="mt-6">
          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
            Restricciones dietéticas
          </label>
          <textarea
            name="dietaryRestrictions"
            id="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: vegetariano, sin gluten, bajo en sodio, dieta cetogénica..."
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: lácteos, frutos secos, mariscos, gluten..."
          ></textarea>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-300"
          >
            Guardar Perfil
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;