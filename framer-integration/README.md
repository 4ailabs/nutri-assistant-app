# Integración con Framer

Este directorio contiene componentes React diseñados para ser integrados en proyectos de Framer.

## Integración mediante iframe

Para integrar el chatbot en tu sitio de Framer, puedes usar un iframe:

```html
<iframe
  src="https://nutri-assistant-app.vercel.app"
  width="100%"
  height="600"
  frameborder="0"
  allow="autoplay; microphone"
></iframe>
```

Puedes ajustar el ancho y alto según tus necesidades.

## Componente React para Framer

Para una integración más personalizada, te recomendamos crear un componente personalizado en Framer usando el código del archivo `FramerChatWidget.jsx`.

### Pasos:

1. En tu proyecto de Framer, crea un nuevo componente código
2. Copia el contenido del archivo `/simple-bot/FramerChatButton.jsx`
3. Asegúrate de actualizar la variable `API_URL` con la URL de tu aplicación desplegada en Vercel
4. Personaliza los estilos según sea necesario