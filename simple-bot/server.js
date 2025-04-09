require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Permitir solicitudes CORS de cualquier origen
app.use(cors({ origin: '*' }));
app.use(express.json());

// Inicializar el cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ID del asistente
const ASSISTANT_ID = 'asst_m3JUAYRxv9QbkmeUy3jArCOo';

// Almacenamiento en memoria de los threads (en producción usarías una base de datos)
const threadStore = {};

// Ruta para crear un nuevo thread o recuperar uno existente
app.post('/api/thread', async (req, res) => {
  try {
    const clientId = req.body.clientId || `client_${Date.now()}`;
    
    // Si ya existe un thread para este cliente, devolverlo
    if (threadStore[clientId]) {
      return res.json({
        clientId,
        threadId: threadStore[clientId]
      });
    }
    
    // Crear un nuevo thread
    const thread = await openai.beta.threads.create();
    threadStore[clientId] = thread.id;
    
    res.json({
      clientId,
      threadId: thread.id
    });
  } catch (error) {
    console.error('Error creando thread:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para enviar un mensaje y obtener respuesta
app.post('/api/chat', async (req, res) => {
  try {
    const { clientId, message } = req.body;
    
    if (!clientId || !message) {
      return res.status(400).json({ error: 'Se requiere clientId y message' });
    }
    
    // Verificar si existe un thread para este cliente
    let threadId = threadStore[clientId];
    
    // Si no existe, crear uno nuevo
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      threadStore[clientId] = threadId;
    }
    
    // Añadir el mensaje al thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });
    
    // Ejecutar el asistente
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID
    });
    
    // Esperar a que termine de ejecutarse
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    // Verificar el estado cada segundo hasta que termine
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }
    
    // Verificar si hubo un error
    if (runStatus.status !== 'completed') {
      return res.status(500).json({ 
        error: 'Error procesando la solicitud',
        status: runStatus.status
      });
    }
    
    // Obtener la respuesta
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // La respuesta más reciente estará al principio
    const lastMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (!lastMessage) {
      return res.status(404).json({ error: 'No se encontró respuesta del asistente' });
    }
    
    // Extraer el contenido de texto
    const responseText = lastMessage.content[0].type === 'text' 
      ? lastMessage.content[0].text.value 
      : 'Contenido no disponible';
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Error en el chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificación de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});