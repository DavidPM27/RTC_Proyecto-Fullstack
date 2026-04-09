# Proyecto Fullstack - Hydrogrow 🌿

Bienvenido al repositorio principal de **Hydrogrow**.

Esta aplicación permite a los usuarios registrarse, explorar un amplio catálogo de plantas y guardar sus especies preferidas en una colección personal (asociándolas dinámicamente a sus perfiles de usuario utilizando bases de datos relacionales simuladas con esquemas de MongoDB).

El proyecto está dividido en dos grandes bloques que se ejecutan y funcionan de forma independiente pero quedan enlazados a través de la red: un cliente visual en React (Frontend) y un servidor RESTful con Node.js (Backend).

---

## Arquitectura del Proyecto

Este proyecto contiene dos directorios raíz dentro del propio espacio de trabajo.
Ambos directorios contienen un archivo **README en profundidad y específico**. Recomiendo su lectura antes de lanzar el proyecto y aprender cómo funciona cada apartado:

### 1. [Leer la Documentación del Backend](./Backend/README.md)

El directorio de servidor y base de datos con:

- Express y Node.js.
- Conexiones a mongoDB (Mongoose).
- Scripts completos de Seed (leer archivos CSV).
- Interfaz con Cloudinary para guardar las imágenes subidas.

### 2. [Leer la Documentación del Frontend](./Frontend/README.md)

El directorio para la interfaz de las vistas de usuario con:

- React 19 empaquetado por Vite.
- Sistema unificado de elementos visuales en base a Chakra UI.
- Validaciones en React Hook Form.

---

## Cómo empezar globalmente

Para correr la aplicación de manera local necesitarás abrir dos procesos en terminales separadas o bien usar un terminal dividido en tu editor de código.

**Terminal 1 (Backend):**
Navega hasta la carpeta Backend y levanta el servidor local.

```powershell
cd Backend
npm install
# Antes de continuar y arrancar deberías configurar el .env
npm run dev
```

**Terminal 2 (Frontend):**
Navega hasta la carpeta Frontend y levanta el entorno de servidor en live server.

```powershell
cd Frontend
npm install
# Asegúrate en el `.env` de tu ruta VITE_API_URL, lo normal es http://localhost:3000/api/v1
npm run dev
```

_(Recuerda consultar la documentación individual enlazada arriba para rellenar tus variables de entorno correctamente)_.

---

## Autor

**David Pintado Morales**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)
