# Guía de Integración con Framer

Esta guía detalla paso a paso cómo integrar el Asistente Nutricional en tu proyecto de Framer.

## Requisitos previos

1. Una cuenta en Railway para desplegar el backend
2. Una cuenta en GitHub para alojar el código
3. Una clave de API de OpenAI
4. Una cuenta en Framer para la integración final

## Paso 1: Preparación del repositorio

1. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Commit inicial"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/nutri-assistant.git
   git push -u origin main
   ```

## Paso 2: Despliegue del backend en Railway

1. Instala la CLI de Railway:
   ```bash
   npm install -g @railway/cli
   ```

2. Inicia sesión en Railway:
   ```bash
   railway login
   ```

3. Vincula tu proyecto:
   ```bash
   railway link
   ```

4. Configura las variables de entorno:
   ```bash
   railway variables set OPENAI_API_KEY=tu_clave_api_de_openai
   railway variables set ALLOWED_ORIGINS=https://tu-sitio-framer.com,http://localhost:3000
   railway variables set NODE_ENV=production
   ```

5. Despliega tu aplicación:
   ```bash
   railway up
   ```

6. Obtén la URL de tu backend:
   ```bash
   railway domain
   ```

## Paso 3: Integración en Framer

### Método 1: Componente de código personalizado

1. En Framer, abre tu proyecto
2. Haz clic en "+" y selecciona "Code"
3. Crea un nuevo componente de código
4. Copia el contenido del archivo `framer-integration/ChatWidget.jsx`
5. Reemplaza la URL de la API con la URL de tu backend obtenida de Railway
6. Guarda el componente y añádelo a tu diseño
7. Ajusta tamaño y posición según necesites

### Método 2: Usando un iframe

1. Despliega el frontend en un servicio como Vercel o Netlify
2. Configura las variables de entorno en el servicio de hosting:
   - `REACT_APP_API_URL=https://tu-backend-railway.up.railway.app`
3. En Framer, añade un elemento iframe
4. Configura el iframe con la URL de tu frontend desplegado

## Personalización del componente

### Estilos

El componente utiliza Tailwind CSS para los estilos. Puedes personalizar la apariencia modificando las clases en el archivo `ChatWidget.jsx`. Algunas secciones que puedes personalizar:

- Colores: busca clases como `bg-green-600` y reemplaza con tu color de marca
- Tipografía: modifica clases como `text-xl` o `font-semibold`
- Bordes y sombras: ajusta clases como `rounded-lg` o `shadow-md`

### Funcionalidad

Para añadir características adicionales, puedes modificar el componente:

- Añadir un botón para borrar la conversación
- Implementar un sistema de feedback para las respuestas
- Añadir opciones de compartir las respuestas

## Resolución de problemas

### Errores de CORS

Si encuentras errores de CORS, verifica:

1. Que tu dominio de Framer esté incluido en la variable `ALLOWED_ORIGINS` del backend
2. Que estás usando HTTPS tanto en Framer como en tu backend

### Problemas de conexión

Si no puedes conectar con el backend:

1. Verifica que el backend esté correctamente desplegado (`railway status`)
2. Comprueba que la URL de la API en el componente de Framer sea correcta
3. Asegúrate de que tu clave de API de OpenAI sea válida y esté correctamente configurada