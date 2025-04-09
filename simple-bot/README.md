# Simple Bot - Asistente Nutricional para Framer

Este proyecto proporciona un chat bot simple que se integra fácilmente en sitios web de Framer, conectando con un Asistente de OpenAI.

## Características

- ✅ Botón flotante que abre un chat
- ✅ Conecta con un Asistente de OpenAI existente
- ✅ Mantiene el historial de conversación entre sesiones
- ✅ Diseño responsivo y adaptable a móviles
- ✅ Fácil integración en Framer

## Estructura

El proyecto consta de dos partes:

1. **Backend**: Un servidor Express simple que maneja las comunicaciones con la API de OpenAI
2. **Componente Framer**: Un componente React que proporciona la interfaz de usuario

## Despliegue 

### Backend

Para desplegar el backend, tienes dos opciones recomendadas:

#### Opción 1: Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Instala Vercel CLI: `npm i -g vercel`
3. En la carpeta del proyecto, ejecuta:
   ```
   vercel
   ```
4. Configura las variables de entorno en el panel de Vercel:
   - `OPENAI_API_KEY`: Tu clave de API de OpenAI
   - Asegúrate de que el ID del asistente en `server.js` sea correcto

#### Opción 2: Railway

1. Crea una cuenta en [Railway](https://railway.app) si aún no tienes una
2. Conecta tu repositorio de GitHub
3. Configura un nuevo proyecto apuntando a la carpeta `simple-bot`
4. Configura las variables de entorno:
   - `OPENAI_API_KEY`: Tu clave de API de OpenAI
   - Asegúrate de que el ID del asistente en `server.js` sea correcto

### Componente Framer

1. En Framer, crea un nuevo componente de código
2. Copia y pega el contenido de `FramerChatButton.jsx`
3. Actualiza la variable `API_URL` con la URL de tu backend desplegado:
   ```javascript
   const API_URL = "https://tu-backend-desplegado.vercel.app";
   ```
4. Añade el componente a tu diseño

## Uso en Framer

1. Una vez añadido el componente a tu página, aparecerá un botón flotante en la esquina inferior derecha
2. Los visitantes pueden hacer clic en el botón para abrir el chat
3. El historial de conversación se guarda en localStorage para mantener el contexto entre visitas
4. El diseño es completamente responsivo y se adapta a dispositivos móviles

## Personalización

Puedes personalizar el componente Framer modificando:

- Colores: Busca clases como `bg-blue-600` y cámbialas por tus colores de marca
- Posición: Modifica `bottom-6 right-6` para cambiar la posición del botón
- Tamaño: Ajusta `w-14 h-14` para el botón y `w-80 sm:w-96 h-96` para el panel

## Solución de problemas

Si encuentras problemas, verifica:

1. Que la URL del backend es correcta en el componente Framer
2. Que la clave API de OpenAI está correctamente configurada
3. Que el ID del asistente en el servidor es correcto
4. Que no hay restricciones CORS que bloqueen las solicitudes