require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 8080;

// Configuración permisiva de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
}));

// Log de todas las solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origen: ${req.headers.origin || 'No origen'}`);
  next();
});

app.use(express.json());

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ID del asistente de OpenAI previamente creado
const ASSISTANT_ID = 'asst_m3JUAYRxv9QbkmeUy3jArCOo';

// Almacenamiento en memoria para las conversaciones (en producción usarías una base de datos)
const threads = new Map();

// Endpoint para iniciar una nueva conversación
app.post('/api/start', async (req, res) => {
  try {
    console.log('Iniciando nueva conversación');
    
    // Crear un nuevo thread para esta conversación
    const thread = await openai.beta.threads.create();
    
    // Guardar identificador de usuario (opcional)
    const userId = req.body.userId || `user_${Date.now()}`;
    threads.set(userId, thread.id);
    
    console.log(`Nuevo thread creado: ${thread.id} para usuario: ${userId}`);
    
    res.json({ 
      userId,
      threadId: thread.id,
      message: "Conversación iniciada con éxito"
    });
  } catch (error) {
    console.error('Error al iniciar conversación:', error);
    res.status(500).json({ 
      error: 'Error al iniciar conversación', 
      details: error.message 
    });
  }
});

// Endpoint para enviar mensajes al asistente
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'Se requiere userId y message' });
    }

    // Obtener el threadId para este usuario
    const threadId = threads.get(userId);
    if (!threadId) {
      return res.status(404).json({ error: 'Conversación no encontrada. Inicia una nueva conversación primero.' });
    }

    console.log(`Procesando mensaje para usuario ${userId} en thread ${threadId}`);
    console.log(`Mensaje: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);

    // Añadir el mensaje del usuario al thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });

    // Ejecutar el asistente en el thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID
    });

    // Esperar a que el asistente termine de procesar
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    // Esperar mientras el asistente está procesando
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      console.log(`Ejecución en progreso... Estado: ${runStatus.status}`);
      
      // Esperar 1 segundo antes de verificar de nuevo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar estado
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Verificar si la ejecución fue exitosa
    if (runStatus.status !== 'completed') {
      console.error(`Ejecución fallida. Estado: ${runStatus.status}`);
      return res.status(500).json({ 
        error: 'Error al procesar el mensaje', 
        status: runStatus.status,
        details: runStatus.last_error || 'Sin detalles'
      });
    }

    // Obtener los mensajes del thread (incluida la respuesta del asistente)
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // El mensaje más reciente del asistente estará primero en la lista
    const assistantMessages = messages.data
      .filter(msg => msg.role === 'assistant')
      .map(msg => ({
        id: msg.id,
        content: msg.content[0].text.value
      }));

    // Tomar el mensaje más reciente del asistente (el primero en la lista)
    const latestResponse = assistantMessages[0]?.content || "No se recibió respuesta del asistente.";
    
    console.log(`Respuesta del asistente: "${latestResponse.substring(0, 50)}${latestResponse.length > 50 ? '...' : ''}"`);
    
    res.json({ response: latestResponse });
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    res.status(500).json({ 
      error: 'Error al procesar mensaje', 
      details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// Endpoint de verificación de estado
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    assistantId: ASSISTANT_ID
  });
});

// Página de inicio
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API del Asistente Nutricional</title>
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
          .post {
            background-color: #3b82f6;
          }
          .get {
            background-color: #10b981;
          }
        </style>
      </head>
      <body>
        <h1>API del Asistente Nutricional</h1>
        <p>Esta API conecta con un Asistente personalizado de OpenAI. Para utilizar este servicio, debes hacer peticiones a los siguientes endpoints:</p>
        
        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/start</h3>
          <p>Inicia una nueva conversación y devuelve un ID de usuario para identificarla.</p>
          <p><strong>Cuerpo de la petición (opcional):</strong></p>
          <pre><code>{
  "userId": "identificador_opcional"
}</code></pre>
        </div>
        
        <div class="endpoint">
          <h3><span class="method post">POST</span> /api/chat</h3>
          <p>Envía un mensaje al asistente y recibe una respuesta.</p>
          <p><strong>Cuerpo de la petición:</strong></p>
          <pre><code>{
  "userId": "el_id_recibido_anteriormente",
  "message": "¿Qué alimentos son ricos en proteínas?"
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
  console.log(`Servidor de Asistente ejecutándose en http://localhost:${port}`);
});