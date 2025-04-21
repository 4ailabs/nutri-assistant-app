require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Cargar los archivos JSON del Genotipo 1 Hunter y combinar los datos
let genotipoData = { superfoods: { categories: {} }, avoidances: { categories: {} } };
try {
  // Cargar parte 1 (estructura base y primeras categorías de superfoods)
  const part1Path = path.join(__dirname, 'data', 'deepseek-genotipo-1-hunter-part1.json');
  const part1Data = JSON.parse(fs.readFileSync(part1Path, 'utf8'));
  
  // Cargar parte 2 (resto de superfoods y primera parte de avoidances)
  const part2Path = path.join(__dirname, 'data', 'deepseek-genotipo-1-hunter-part2.json');
  const part2Data = JSON.parse(fs.readFileSync(part2Path, 'utf8'));
  
  // Cargar parte 3 (resto de avoidances)
  const part3Path = path.join(__dirname, 'data', 'deepseek-genotipo-1-hunter-part3.json');
  const part3Data = JSON.parse(fs.readFileSync(part3Path, 'utf8'));

  // Crear la estructura base
  genotipoData = {
    genotype: part1Data.genotype,
    description: part1Data.description,
    superfoods: {
      title: part1Data.superfoods.title,
      guidance: part1Data.superfoods.guidance,
      categories: { ...part1Data.superfoods.categories }
    },
    avoidances: {
      title: part2Data.avoidances_part1.title,
      guidance: part2Data.avoidances_part1.guidance,
      categories: { ...part2Data.avoidances_part1.categories }
    }
  };

  // Añadir el resto de categorías de superfoods
  for (const category in part2Data.superfoods_continued.categories) {
    genotipoData.superfoods.categories[category] = part2Data.superfoods_continued.categories[category];
  }

  // Añadir el resto de categorías de avoidances
  for (const category in part3Data.avoidances_part2.categories) {
    genotipoData.avoidances.categories[category] = part3Data.avoidances_part2.categories[category];
  }

  console.log("Información del Genotipo 1 Hunter cargada correctamente");
} catch (error) {
  console.error("Error al cargar los archivos JSON del Genotipo 1 Hunter:", error);
  genotipoData = { 
    superfoods: { categories: {} }, 
    avoidances: { categories: {} }
  };
}

// Configuración de CORS - Permitir orígenes específicos
app.use(cors({
  origin: ['https://framer.com', 'https://www.framer.com', 'https://tu-sitio-en-framer.framer.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: true
}));

// Log de todas las solicitudes para depuración
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origen: ${req.headers.origin || 'No origen'}`);
  next();
});

app.use(express.json());

// Cliente para DeepSeek API
const deepseekAPI = axios.create({
  baseURL: 'https://api.deepseek.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  }
});

// Middleware para verificar la API key
const verifyApiKey = (req, res, next) => {
  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key no configurada en el servidor' });
  }
  next();
};

// Endpoint para el asistente nutricional
app.post('/api/nutrition-advice', verifyApiKey, async (req, res) => {
  try {
    // Log para depuración
    console.log(`Recibida solicitud desde: ${req.headers.origin || 'Origen desconocido'}`);
    
    try {
      const { message, userInfo } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Se requiere un mensaje' });
      }
      
      console.log(`Mensaje recibido: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
      console.log('Información del usuario:', JSON.stringify(userInfo || {}, null, 2));

      // Contexto del sistema para el asistente nutricional basado en GenoTipos
      const systemMessage = `Eres un asistente experto en nutrición basado en Nutrición por GenoTipos. Utilizas una base de datos JSON estructurada que contiene información sobre alimentos recomendados (superfoods) y alimentos a evitar (avoidances) para el perfil 'Genotipo 1 (Hunter)'.

La estructura de datos para cada alimento incluye campos como 'name', 'is_extra_beneficial' (booleano), 'avoidance_type' ('temporary' o 'permanent') y 'notes'.

**Reglas Fundamentales de la Dieta:**

1. **Superalimentos (◊):** Los alimentos marcados como \`is_extra_beneficial: true\` son activadores metabólicos excelentes para este grupo, mejorando la pérdida de peso y la construcción muscular. Deben consumirse regularmente.
2. **Evitaciones Temporales (•):** Los alimentos marcados como \`avoidance_type: "temporary"\` deben evitarse durante un período mínimo de 'limpieza' de 60 días. Después de este tiempo, pueden reintroducirse cuidadosamente en la dieta.
3. **Evitaciones Permanentes:** Los alimentos marcados como \`avoidance_type: "permanent"\` deben evitarse de forma general a largo plazo por este grupo.
4. **Alimentos Neutros:** **Importante:** Si un alimento **no se encuentra** en ninguna de las categorías dentro de 'superfoods' ni dentro de 'avoidances' en la base de datos proporcionada, considéralo un alimento **'neutro'** para el perfil Genotipo 1 Hunter. Los alimentos neutros son generalmente permisibles y se pueden consumir sin restricciones específicas según este plan.

**Instrucción Clave de Formato al Responder:**

Cuando presentes información sobre alimentos específicos o listas de alimentos al usuario, debes formatear el nombre del alimento de la siguiente manera, basándote en los campos del JSON:

1. **Superalimentos Extra Beneficiosos:** Si \`is_extra_beneficial\` es \`true\`, muestra el \`name\` seguido por ◊.
   * *Ejemplo:* \`{"name": "Res", "is_extra_beneficial": true}\` -> \`Res◊\`.

2. **Evitaciones Temporales:** Si \`avoidance_type\` es \`"temporary"\`, muestra el \`name\` seguido por •.
   * *Ejemplo:* \`{"name": "Tocino", "avoidance_type": "temporary"}\` -> \`Tocino•\`.

3. **Otros Alimentos (Superalimentos normales, Evitaciones permanentes, Neutros mencionados):** Si ninguna de las condiciones anteriores se cumple, muestra únicamente el \`name\` sin símbolo.
   * *Ejemplo (Superalimento Normal):* \`{"name": "Pollo", "is_extra_beneficial": false}\` -> \`Pollo\`.
   * *Ejemplo (Evitación Permanente):* \`{"name": "Cerdo", "avoidance_type": "permanent"}\` -> \`Cerdo\`.
   * *Ejemplo (Neutro si lo mencionas):* Si hablas de un alimento que sabes que es neutro (porque no está en las listas), simplemente usa su nombre.

**Aplicación:**
* Aplica este formato siempre que nombres un alimento específico recuperado de la base de datos o cuando generes listas.
* Cuando el usuario pregunte sobre un alimento específico que *no esté en las listas*, infórmale que se considera 'neutro' para este perfil y generalmente se puede consumir sin restricciones.
* Recuerda que los símbolos ◊ y • son solo para la *presentación*. Tu lógica interna debe seguir basándose en los valores de los campos estructurados.
* Si mencionas notas (como Ω3), puedes incluirlas después del nombre y su símbolo si aplica (Ej: \`Salmón rey Ω3◊\`).

Debes considerar la siguiente información del usuario (si está disponible):
- Edad: ${userInfo?.age || 'No proporcionada'}
- Género: ${userInfo?.gender || 'No proporcionado'}
- Peso: ${userInfo?.weight || 'No proporcionado'}
- Altura: ${userInfo?.height || 'No proporcionada'}
- Objetivos: ${userInfo?.goals || 'No proporcionados'}
- Restricciones dietéticas: ${userInfo?.dietaryRestrictions || 'No proporcionadas'}
- Alergias: ${userInfo?.allergies || 'No proporcionadas'}

Utiliza la siguiente información de base de datos para tus recomendaciones:
${JSON.stringify(genotipoData)}`;

      console.log('Enviando solicitud a DeepSeek...');
      const response = await deepseekAPI.post('/chat/completions', {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        stream: false
      });
      
      console.log('Respuesta recibida de DeepSeek');
      res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
      // Error al procesar el cuerpo de la solicitud
      console.error('Error al procesar la solicitud:', error);
      return res.status(400).json({ 
        error: 'Error al procesar la solicitud', 
        details: error.message 
      });
    }
  } catch (apiError) {
    console.error('Error al comunicarse con DeepSeek:', apiError);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud con DeepSeek', 
      details: apiError.message,
      stack: process.env.NODE_ENV !== 'production' ? apiError.stack : undefined
    });
  }
});

// Endpoint para obtener datos del Genotipo Hunter directamente
app.get('/api/genotipo-data', (req, res) => {
  res.json({ 
    status: 'OK', 
    data: genotipoData
  });
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
        <title>API Asistente Nutricional GenoTipo 1 Hunter</title>
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
        <h1>API del Asistente Nutricional GenoTipo 1 Hunter</h1>
        <p>Esta es la API del servicio de asistente nutricional basado en el GenoTipo 1 Hunter. Para utilizar este servicio, debes hacer peticiones a los siguientes endpoints:</p>
        
        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/nutrition-advice</h3>
          <p>Envía una consulta al asistente nutricional y recibe recomendaciones personalizadas.</p>
          <p><strong>Cuerpo de la petición:</strong></p>
          <pre><code>{
  "message": "¿Qué alimentos son recomendados para mi GenoTipo 1 Hunter?",
  "userInfo": {
    "age": "30",
    "gender": "masculino",
    "weight": "80",
    "height": "175",
    "goals": "Pérdida de peso",
    "dietaryRestrictions": "Sin lácteos",
    "allergies": "Frutos secos"
  }
}</code></pre>
        </div>
        
        <div class="endpoint">
          <h3><span class="method get">GET</span> /api/genotipo-data</h3>
          <p>Obtiene los datos completos sobre el GenoTipo 1 Hunter.</p>
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