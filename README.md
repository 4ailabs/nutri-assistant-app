# Asistente de Orientación Nutricional

Un chatbot de orientación nutricional impulsado por OpenAI que proporciona consejos personalizados basados en el perfil del usuario.

## Características

- Interfaz de chat amigable para consultas nutricionales
- Perfil de usuario personalizable para recomendaciones específicas
- Respuestas basadas en IA con OpenAI
- Diseño responsive para dispositivos móviles y de escritorio
- Formato de Markdown para respuestas bien estructuradas

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend

- API REST construida con Express.js
- Integración con la API de OpenAI
- Manejo de solicitudes y respuestas del chat
- Procesamiento de información del perfil del usuario

### Frontend

- Interfaz de usuario React
- Estilizado con Tailwind CSS
- Formulario de perfil del usuario
- Interfaz de chat en tiempo real

## Requisitos

- Node.js 16+
- Cuenta de OpenAI con clave API

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nutri-assistant.git
cd nutri-assistant
```

### 2. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita el archivo `.env` con tu clave API de OpenAI.

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
```

### 4. Iniciar el desarrollo

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Despliegue

### Railway

1. Conecta tu repositorio de GitHub a Railway:
   ```
   railway link
   ```

2. Configura las variables de entorno necesarias:
   ```
   railway variables set OPENAI_API_KEY=tu_clave_api_de_openai
   railway variables set ALLOWED_ORIGINS=https://tu-sitio-framer.com,http://localhost:3000
   ```

3. Despliega tu aplicación:
   ```
   railway up
   ```

4. Obtén la URL de tu API:
   ```
   railway domain
   ```

### Framer Integration

Para integrar en Framer, tienes dos opciones:

#### Opción 1: Usar el componente de código personalizado

1. Despliega el backend en Railway
2. En Framer, crea un nuevo componente de código
3. Copia el contenido del archivo `/framer-integration/ChatWidget.jsx`
4. Actualiza la variable `API_URL` con la URL de tu backend en Railway
5. Añade el componente a tu diseño de Framer

#### Opción 2: Usar un iframe

1. Despliega tanto el backend como el frontend:
   - Backend: En Railway
   - Frontend: En Vercel, Netlify u otro servicio de hosting
2. En Framer, añade un componente de iframe
3. Configura el iframe para que apunte a la URL del frontend

## Licencia

MIT

## Créditos

Desarrollado por Miguel Ojeda