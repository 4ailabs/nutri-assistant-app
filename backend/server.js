require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://framer.com', 'https://framer.website'];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware para verificar la API key
const verifyApiKey = (req, res, next) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key no configurada en el servidor' });
  }
  next();
};

// Endpoint para el asistente nutricional
app.post('/api/nutrition-advice', verifyApiKey, async (req, res) => {
  try {
    const { message, userInfo } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Se requiere un mensaje' });
    }

    // Contexto del sistema para el asistente nutricional
    const systemMessage = `Eres un asistente de orientación nutricional profesional. 
    Tu objetivo es proporcionar información nutricional precisa, consejos de alimentación saludable 
    y recomendaciones basadas en evidencia científica. 
    
    Debes considerar la siguiente información del usuario (si está disponible):
    - Edad: ${userInfo?.age || 'No proporcionada'}
    - Género: ${userInfo?.gender || 'No proporcionado'}
    - Peso: ${userInfo?.weight || 'No proporcionado'}
    - Altura: ${userInfo?.height || 'No proporcionada'}
    - Objetivos: ${userInfo?.goals || 'No proporcionados'}
    - Restricciones dietéticas: ${userInfo?.dietaryRestrictions || 'No proporcionadas'}
    - Alergias: ${userInfo?.allergies || 'No proporcionadas'}
    
    Recuerda que no eres un médico y debes aconsejar buscar ayuda profesional para problemas médicos o nutricionales serios.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 1000
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud', 
      details: error.message 
    });
  }
});

// Endpoint de verificación de estado
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Ruta raíz para mostrar información básica
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Asistente Nutricional</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #4f46e5;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .endpoint {
            background-color: #f9fafb;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #4f46e5;
          }
          code {
            background-color: #e5e7eb;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
          }
          .method {
            font-weight: bold;
            display: inline-block;
            padding: 3px 6px;
            border-radius: 4px;
            color: white;
            font-size: 0.85em;
            margin-right: 8px;
          }
          .get {
            background-color: #10b981;
          }
          .post {
            background-color: #3b82f6;
          }
        </style>
      </head>
      <body>
        <h1>API del Asistente Nutricional</h1>
        <p>Esta es la API del servicio de asistente nutricional. Para utilizar este servicio, debes hacer peticiones a los siguientes endpoints:</p>
        
        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/nutrition-advice</h3>
          <p>Envía una consulta al asistente nutricional y recibe recomendaciones personalizadas.</p>
          <p><strong>Cuerpo de la petición:</strong></p>
          <pre><code>{
  "message": "¿Qué alimentos son ricos en proteína?",
  "userInfo": {
    "age": "30",
    "gender": "femenino",
    "weight": "65",
    "height": "170",
    "goals": "Ganar masa muscular",
    "dietaryRestrictions": "Vegetariana",
    "allergies": "Nueces"
  }
}</code></pre>
        </div>
        
        <div class="endpoint">
          <h3><span class="method get">GET</span> /api/health</h3>
          <p>Comprueba el estado del servidor.</p>
        </div>
        
        <p>Para más información, consulta la <a href="https://github.com/4ailabs/nutri-assistant-app">documentación en GitHub</a>.</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
