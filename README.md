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
- Cuenta en Vercel para el despliegue

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/4ailabs/nutri-assistant-app.git
cd nutri-assistant-app
```

### 2. Configurar el entorno

```bash
cp .env.example .env
npm run install-all
```

Edita el archivo `.env` con tu clave API de OpenAI.

### 3. Iniciar el desarrollo

```bash
npm run dev
```

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno necesarias:
   - `OPENAI_API_KEY`: Tu clave API de OpenAI
3. Asegúrate de que Vercel esté configurado para usar Node.js 16 o superior
4. Despliega tu aplicación

## Integración con Framer

Para integrar en Framer, tienes dos opciones:

### Opción 1: Usar un iframe

1. En Framer, añade un componente de iframe
2. Configura el iframe para que apunte a la URL de tu aplicación en Vercel:

```html
<iframe
  src="https://nutri-assistant-app.vercel.app"
  width="100%"
  height="600"
  frameborder="0"
></iframe>
```

### Opción 2: Usar el componente de código personalizado

1. En Framer, crea un nuevo componente de código
2. Copia el contenido del archivo `/simple-bot/FramerChatButton.jsx`
3. Actualiza la variable `API_URL` con la URL de tu aplicación en Vercel
4. Añade el componente a tu diseño de Framer

Para más detalles, consulta la documentación en `/framer-integration/README.md`.

## Licencia

MIT

## Créditos

Desarrollado por Miguel Ojeda