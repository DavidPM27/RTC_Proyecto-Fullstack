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
- Gestión de rutas: Navegación estructurada (Home, Catálogo de plantas, Detalle de planta, Login). Rutas protegidas mediante `ProtectedRoute`.
- Consumo de API: Integración completa con todos los endpoints del backend — autenticación, jardín del usuario (añadir del catálogo, añadir planta personalizada, eliminar, regar) y administración del catálogo para el rol `admin`.
- Subida de imágenes: Las plantas personalizadas se envían como `FormData` al backend, que las sube a Cloudinary y devuelve la URL pública.
- Diseño y UX: Chakra UI para una interfaz moderna, responsive y accesible. Menú lateral fijo (`position: sticky`) en escritorio y barra inferior fija en móvil.
- Manejo de Formularios: `react-hook-form` para login, registro, restablecimiento de contraseña y creación de plantas personalizadas.
- Detección de rol admin: El JWT se decodifica en el cliente para mostrar u ocultar controles exclusivos de administrador (ej. botón de eliminar planta del catálogo).

## Estructura relevante
- `src/api/` — Servicios para interactuar con la API de Hydrogrow (`authApi.js`, `plantsApi.js`).
- `src/components/` — Componentes reutilizables de UI (Botones, Tarjetas de Plantas, Formularios, Menú).
- `src/pages/` — Vistas principales enrutadas por React Router (Home, Catalog, Detail, Login, AddPlant).
- `src/context/` — `GardenContext`: estado global del jardín del usuario. Todas las operaciones (añadir, eliminar, regar) persisten en el backend.
- `src/hooks/` — Custom hooks (`useGarden`, `useWeather`) para separar lógica de los componentes.
- `src/theme/` — Configuración personalizada y tokens de diseño para Chakra UI.
- `src/utils/` — Utilidades: `capitalize.js`, `cloudinaryOptimize.js` y `auth.js` (decodificación de JWT y detección de rol `admin`).
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
En **desarrollo local** no se necesita ningún `.env` — Vite proxifica automáticamente `/api/*` al backend en `http://localhost:3000` (configurado en `vite.config.js`).

Para **producción**, crea un archivo `.env` en la raíz de `Frontend`:
```
VITE_API_URL=https://tu-backend.onrender.com
```


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
- Toda la comunicación autenticada pasa el token (almacenado en `localStorage` o `sessionStorage` tras el login) en el header `Authorization: Bearer <token>`.
- `GardenContext` expone `addPlant`, `removePlant` y `waterPlant` como funciones asíncronas que persisten los cambios en el backend antes de actualizar el estado local.
- Las plantas personalizadas (formulario "Add Plant") se envían como `FormData` para permitir la subida de imagen. El backend usa multer + Cloudinary y devuelve la URL pública que se almacena en el documento `Plant`.
- El rol del usuario se obtiene decodificando el payload del JWT en `src/utils/auth.js` (sin necesidad del secret, solo lectura base64). El backend incluye `role` en el token desde el login. Esta información se usa solo para decisiones de UI; la seguridad real la aplica el backend.
- El menú lateral usa `position: sticky` con `height: 100vh` para permanecer visible mientras el contenido de cada página scrollea de forma independiente.
- React Hook Form alivia la carga de re-renderizados al tipear. Chakra UI se configura globalmente desde `src/theme/` en `src/main.jsx`.

## Contact

David Pintado Morales

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)
