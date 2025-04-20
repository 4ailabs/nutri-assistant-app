# Asistente de Orientación Nutricional para GenoTipo 1 Hunter

Un chatbot de orientación nutricional impulsado por DeepSeek que proporciona consejos personalizados basados en el perfil del usuario y específicamente enfocado en el GenoTipo 1 Hunter.

## Características

- Interfaz de chat amigable para consultas nutricionales
- Perfil de usuario personalizable para recomendaciones específicas
- Respuestas basadas en IA con DeepSeek
- Sistema de notación especial para alimentos:
  - ◊ = Superalimentos extra beneficiosos
  - • = Evitaciones temporales
- Diseño responsive para dispositivos móviles y de escritorio
- Base de datos de alimentos específica para GenoTipo 1 Hunter

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

### Backend

- API REST construida con Express.js
- Integración con la API de DeepSeek
- Manejo de solicitudes y respuestas del chat
- Procesamiento de información del perfil del usuario
- Base de datos JSON con información de GenoTipo 1 Hunter

### Frontend

- Interfaz de usuario React
- Estilizado con Tailwind CSS
- Formulario de perfil del usuario
- Interfaz de chat en tiempo real

## Requisitos

- Node.js 16+
- Cuenta de DeepSeek con clave API
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

Edita el archivo `.env` con tu clave API de DeepSeek.

### 3. Configurar el archivo de datos GenoTipo

Asegúrate de que tu archivo `deepseek-genotipo-1-hunter.json` esté ubicado en la carpeta `/backend/data/`.

### 4. Iniciar el desarrollo

```bash
npm run dev
```

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno necesarias:
   - `DEEPSEEK_API_KEY`: Tu clave API de DeepSeek
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

## Sistema de Notación de Alimentos

El sistema utiliza la siguiente notación para los alimentos:

- **Superalimentos extra beneficiosos (◊)**: Alimentos que son especialmente recomendados para el GenoTipo 1 Hunter. Estos alimentos son activadores metabólicos excelentes, mejorando la pérdida de peso y la construcción muscular.
- **Evitaciones temporales (•)**: Alimentos que deben evitarse durante un período mínimo de 'limpieza' de 60 días. Después de este tiempo, pueden reintroducirse cuidadosamente en la dieta.
- **Evitaciones permanentes**: Alimentos que deben evitarse a largo plazo por este genotipo.
- **Alimentos neutros**: Alimentos que no aparecen en ninguna lista. Estos son generalmente permisibles y se pueden consumir sin restricciones específicas.

## Licencia

MIT

## Créditos

Desarrollado por Miguel Ojeda