# Proyecto_Frontend (Hydrogrow)

Frontend para el proyecto ThePower (SPA en React con Vite).
Consiste en la interfaz de usuario para la gestión de usuarios, colecciones de plantas y el acceso al catálogo de **Hydrogrow**.

## Tecnologías principales
- React (v19)
- Vite
- Chakra UI (Componentes y sistema de diseño)
- React Router DOM (Enrutamiento)
- React Hook Form (Gestión y validación de formularios)
- ESLint + Prettier (Mantenimiento de código)

## Qué hace este proyecto
- Interfaz de usuario: Vistas interactivas y dinámicas para visualizar catálogos y colecciones de plantas.
- Gestión de rutas: Navegación estructurada (ej. Home, Perfil de Usuario, Catálogo de plantas, Registro, Login).
- Consumo de API: Integración con los endpoints del backend para leer información, actualizar el perfil del usuario, añadir plantas a su colección personal o la administración completa para el rol de `admin`.
- Diseño y UX: Uso del framework Chakra UI para garantizar una interfaz moderna, responsive y accesible.
- Manejo de Formularios: Utilización de `react-hook-form` para realizar operaciones complejas como inicio de sesión, registro con subida de imagen, y añadir plantas nuevas al catálogo.

## Estructura relevante
- `src/api/` — Controladores o servicios para interactuar directametne con la API de Hydrogrow.
- `src/components/` — Componentes reutilizables de UI (Botones, Tarjetas de Plantas, Formularios).
- `src/pages/` — Vistas o pantallas principales enrutadas por React Router.
- `src/context/` — Contexto de React para manejo de estado global (como la sesión del usuario actual).
- `src/hooks/` — Custom hooks enfocados en dividir la lógica y las operaciones de estados.
- `src/theme/` — Configuración personalizada y tokens de diseño para Chakra UI.
- `src/utils/` — Utilidades externas.
- `src/assets/` — Imágenes estáticas, fuentes o recursos.

## Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- **Backend ejecutándose en paralelo**

### Pasos

1. Asegúrate de estar en la carpeta del repositorio y sitúate en el frontend:
```powershell
cd /camino/a/RTC_Proyecto-Backend/Frontend
```

2. Instala las dependencias:
```powershell
npm install
```

3. Variables de Entorno:
Crea un archivo `.env` en la raíz de `Frontend` con las variables de conexión a tu API:
```
VITE_API_URL=http://localhost:3000/api/v1
```
*(Asegúrate de comprobar en qué puerto se está ejecutando el Backend y ajustar la URL de manera acorde. No requiere comillas la URL).*

4. Inicia el servidor en modo desarrollo:
```powershell
npm run dev
```

La aplicación estará disponible a través de lo que indique Vite (típicamente `http://localhost:5173`).

## Scripts principales

- `npm run dev`: Levanta el servidor local con Hot Module Replacement (HMR).
- `npm run build`: Genera la "build" de producción y la deposita en la carpeta `dist`.
- `npm run preview`: Sirve locamente el resultado para previsualizar la build de producción.
- `npm run lint`: Aplica Prettier en el formato y comprueba posibles errores con ESLint.

## Notas técnicas
- Toda la comunicación autenticada se debe realizar pasando el token (almacenado habitualmente tras el login en localStorage o en memoria del `context`) al header `Authorization: Bearer <token>`.
- React Hook Form está configurado para aliviar la carga de re-renderizados continuos a la hora de tipear los datos.
- Chakra UI se configura globalmente desde `src/theme/` y envuelve la aplicación en su Provider central en `src/main.jsx`.

## Contact

David Pintado Morales

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)
