# Proyecto_Backend (Hydrogrow)

Backend para el proyecto ThePower (servicio REST en Node.js).
Se basa en un servidor para manejar colecciones de usuarios y de plantas.

## Tecnologías principales
- Node.js
- Express
- MongoDB empleando Mongoose
- Autenticación basada en JWT
- Cloudinary (gestión de imágenes)
- Sistema basado en importación CSV

## Qué hace este proyecto
- Gestión de usuarios: Registro, login, eliminación, obtención y cambio de rol.
- Sistema de "plantas": Catálogo con la colección de plantas disponibles en nuestra base de datos.
- Relación de usuarios y plantas: Añadir plantas del catálogo al jardín personal del usuario, crear plantas personalizadas, eliminarlas del jardín y registrar riegos.
- Gestión de imágenes: Subida de imágenes a Cloudinary tanto en el registro de usuario como en la creación de plantas personalizadas. Al eliminar una planta del catálogo, se borra también su imagen de Cloudinary y todas sus referencias en los jardines de los usuarios.
- Autenticación con roles: JWT que incluye `id`, `email` y `role`. Middlewares de autenticación (`auth`) dependientes de rol (`admin` o `user`).
- Utilidades: Script de seed que lee de `.csv` para llenar automáticamente la base de datos de los datos iniciales y subir sus imágenes a Cloudinary.

## Estructura relevante
- `src/api/models/` — Esquemas Mongoose (`user.model.js`, `plant.model.js`)
- `src/api/controllers/` — Lógica de negocio por recurso (usuarios, plantas)
- `src/api/routes/` — Definición de rutas y protección con middlewares
- `src/data/` — Datos de ejemplo en formato csv (`users_catalog.csv`, `plants_catalog.csv`)
- `src/utils/seed.js` — Script para generar la base de datos procesando los csv y mandando imágenes a Cloudinary
- `src/config/` y `src/utils/` — Configuración de base de datos, Cloudinary y demás utilidades

## Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- MongoDB (local o acceso a un servidor remoto)

### Pasos

1. Clona el repositorio:
```powershell
git clone https://github.com/DavidPM27/RTC_Proyecto-Backend.git
cd RTC_Proyecto-Backend
```

2. Instala las dependencias:
```powershell
npm install
```

3. Configura el archivo `.env`:
Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias:
```
DB_URL=mongodb://localhost:27017/thepower
JWT_SECRET=tu_clave_secreta_aqui
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=3000
```

4. Ejecuta el script de seed (opcional, para poblar la BD con datos de ejemplo y subir todo a Cloudinary):
```powershell
npm run seed
```

5. Inicia el servidor en modo desarrollo:
```powershell
npm run dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto que hayas configurado en `PORT`).

## Endpoints principales

### Usuarios

| Método | Ruta | Autenticación | Descripción |
| ------ | ------ | ------ | ------ |
| GET | `/users` | `isAdmin` | Obtener todos los usuarios (solo admins) |
| POST | `/users/register` | - | Registrar usuario (permite subida de imagen) |
| POST | `/users/login` | - | Iniciar sesión (devuelve JWT con `id`, `email` y `role`) |
| PUT | `/users/reset-password` | - | Restablecer contraseña mediante email (sin autenticación) |
| GET | `/users/me/garden` | `isAuth` | Obtener el jardín del usuario autenticado (plantas populadas) |
| POST | `/users/me/garden/custom` | `isAuth` | Crear una planta personalizada y añadirla al jardín (sube imagen a Cloudinary) |
| DELETE | `/users/me/garden/:entryId` | `isAuth` | Eliminar una planta del jardín del usuario |
| PUT | `/users/me/garden/:entryId/water` | `isAuth` | Actualizar la fecha de último riego de una planta del jardín |
| DELETE | `/users/:id` | `isAuth` | Borrar usuario (admins pueden borrar cualquier cuenta; usuarios sólo la propia) |
| PUT | `/users/changeRole/:id` | `isAdmin` | Cambiar rol de usuario |
| PUT | `/users/:id` | `isAuth` | Actualizar usuario (permite subida de imagen) |
| GET | `/users/:id` | - | Obtener usuario por ID |

### Plantas

| Método | Ruta | Autenticación | Descripción |
| ------ | ------ | ------ | ------ |
| GET | `/plants` | - | Obtener todas las plantas |
| GET | `/plants/:id` | - | Obtener detalle de la planta |
| POST | `/plants` | `isAdmin` | Crear una nueva planta en el catálogo (con imagen) |
| PUT | `/plants/:id` | `isAdmin` | Actualizar información de una planta (con imagen) |
| DELETE | `/plants/:id` | `isAdmin` | Borrar una planta del catálogo: elimina el documento, borra la imagen de Cloudinary y elimina todas las referencias en los jardines de los usuarios |
| POST | `/plants/:id/addToUser` | `isAuth` | Añadir una planta del catálogo al jardín del usuario autenticado |

## Variables de entorno
Crear un archivo `.env` con al menos las siguientes variables:

- `DB_URL` — URI de conexión a MongoDB (ej. `mongodb://localhost:27017/thepower`)
- `JWT_SECRET` — clave para firmar tokens JWT (el token incluye `id`, `email` y `role`)
- `PORT` — puerto del servidor (por defecto `3000`; en producción se recomienda usar `process.env.PORT`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — credenciales de Cloudinary para la subida y eliminación de imágenes

## Seed (poblar BD)
Hay un script de seed extenso que inserta plantas procesando los csv de `src/data/`, sube las fotos a Cloudinary y asocia a los usuarios también hasheando contraseñas.

Ejecutar en PowerShell desde la raíz del proyecto:

```powershell
npm run seed
```

## Ejecutar la aplicación (desarrollo)
Dependiendo de tus `package.json` scripts puedes usar `npm run dev` o ejecutar directamente el fichero de arranque (ej. `node index.js`):

```powershell
npm run dev
# o
node index.js
```

## Notas técnicas
- El modelo `User` guarda el jardín como un array de subdocumentos `{ plant: ObjectId, lastWatered: Date }`. El `_id` de cada subdocumento se usa como `entryId` para las operaciones de jardín.
- Las operaciones que modifican el documento de usuario (añadir/eliminar planta, regar) usan `findByIdAndUpdate` con operadores `$push`, `$pull` y `$set` para evitar disparar el pre-hook de bcrypt del modelo.
- El token JWT incluye `id`, `email` y `role`, lo que permite al frontend determinar los permisos sin una petición adicional.
- Al eliminar una planta del catálogo (`DELETE /plants/:id`) se ejecutan tres operaciones: borrado del documento Plant, `User.updateMany` con `$pull` para limpiar todos los jardines, y eliminación de la imagen en Cloudinary si la URL contiene el dominio de Cloudinary.
- El script de seed se encarga de subir fotos e insertar hashes correctos en la base de datos (`src/utils/seed.js`).
- Protegemos las rutas sensibles con `isAuth` y, cuando proceda, con comprobaciones de rol extra (`isAdmin`).

## Contact

David Pintado Morales

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)