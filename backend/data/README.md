# Sistema de Datos para GenoTipo 1 Hunter

Este directorio contiene los archivos JSON que almacenan la información nutricional para el GenoTipo 1 Hunter. Debido al tamaño del conjunto de datos completo, la información se ha dividido en tres archivos que el servidor combina automáticamente durante la inicialización.

## Estructura de Archivos

- `deepseek-genotipo-1-hunter-part1.json`: Contiene la estructura base, información general y las primeras categorías de superalimentos (Carnes Rojas, Aves, Pescados y Mariscos, Vegetales, Frutas).
- `deepseek-genotipo-1-hunter-part2.json`: Contiene el resto de categorías de superalimentos y las primeras categorías de evitaciones (Grasas y Aceites, Huevos, Proteínas Vegetales, Carbohidratos, Bebidas, Lácteos, Especias, Condimentos).
- `deepseek-genotipo-1-hunter-part3.json`: Contiene el resto de las categorías de evitaciones (Proteínas Vegetales, Carbohidratos, Aves, Huevos, Bebidas, Frutas, Vegetales, Especias, Condimentos).

## Cómo Funciona

El archivo `server.js` contiene la lógica para cargar y combinar estos archivos en una única estructura de datos coherente durante la inicialización del servidor. No es necesario modificar esta lógica a menos que cambies la estructura de los archivos JSON.

## Modificación de los Datos

Si necesitas actualizar la información nutricional:

1. Es recomendable modificar directamente estos archivos en lugar de crear un único archivo grande.
2. Mantén la estructura actual de los archivos para asegurar la compatibilidad con la lógica de combinación.
3. Si añades nuevas categorías, asegúrate de actualizar la lógica de combinación en `server.js`.

## Notación de Alimentos

Los alimentos en esta base de datos siguen una notación específica:

- **Superalimentos Extra Beneficiosos**: Marcados con `is_extra_beneficial: true` y mostrados con el símbolo ◊ en la interfaz (ejemplo: `Res◊`).
- **Evitaciones Temporales**: Marcados con `avoidance_type: "temporary"` y mostrados con el símbolo • en la interfaz (ejemplo: `Tocino•`).
- **Evitaciones Permanentes**: Marcados con `avoidance_type: "permanent"` y mostrados sin símbolo en la interfaz (ejemplo: `Cerdo`).
- **Superalimentos Normales**: Marcados con `is_extra_beneficial: false` y mostrados sin símbolo en la interfaz (ejemplo: `Pollo`).
- **Alimentos Neutros**: No aparecen en ninguna de las listas y se consideran generalmente permisibles para este genotipo.

## API Endpoint

Puedes acceder a los datos combinados a través del endpoint `/api/genotipo-data`, que devuelve la estructura completa en formato JSON.
