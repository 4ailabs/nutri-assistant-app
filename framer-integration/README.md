# Integración con Framer

Esta carpeta contiene los archivos necesarios para integrar el asistente nutricional en tu sitio de Framer.

## Instrucciones para integrar en Framer

### Método 1: Integración como componente de código personalizado

1. En Framer, crea un nuevo componente de código (Code Component)
2. Copia el contenido del archivo `ChatWidget.jsx` en el editor de código
3. Asegúrate de reemplazar la URL de la API con la URL de tu backend desplegado en Railway
4. Guarda el componente y úsalo en tu diseño

### Método 2: Integración vía iframe

1. Despliega el frontend en algún servicio como Vercel o Netlify
2. En Framer, añade un componente de iframe
3. Configura el iframe para que apunte a la URL donde desplegaste el frontend
4. Ajusta las dimensiones según sea necesario

## Requisitos

- Necesitarás tener el backend desplegado en Railway o en algún otro servicio similar
- Actualiza la variable `API_URL` en `ChatWidget.jsx` con la URL de tu backend
- Para evitar problemas de CORS, asegúrate de que tu backend tenga configurado correctamente el dominio de Framer en la lista de orígenes permitidos

## Personalización

Puedes personalizar el aspecto del chat modificando las clases de CSS en el archivo `ChatWidget.jsx`. El componente utiliza Tailwind CSS para el estilizado, pero puedes adaptarlo a tu propio sistema de diseño.

Si necesitas funcionalidades adicionales, consulta la documentación completa del backend en el README principal del proyecto.