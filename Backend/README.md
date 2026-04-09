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
- Sistema de "plantas": Catálogo con la colección de plantas dispobibles en nuestra base de datos.
- Relación de usuarios y plantas: Opción de agregar y relacionar plantas concretas del catálogo con el usuario actual.
- Middlewares: Autenticación (`auth`) dependiente de roles (`admin` o `user`) y subida/gestión de imágenes con Cloudinary.
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
| POST | `/users/login` | - | Iniciar sesión (devuelve JWT) |
| DELETE | `/users/:id` | `isAuth` | Borrar usuario (admins pueden borrar cualquier cuenta; usuarios sólo su propia) |
| PUT | `/users/changeRole/:id` | `isAdmin` | Cambiar rol de usuario |
| PUT | `/users/:id` | `isAuth` | Actualizar usuario (permite subida de imagen) |
| GET | `/users/:id` | - | Obtener usuario |

### Plantas

| Método | Ruta | Autenticación | Descripción |
| ------ | ------ | ------ | ------ |
| GET | `/plants` | - | Obtener todas las plantas |
| GET | `/plants/:id` | - | Obtener detalle de la planta |
| POST | `/plants` | `isAdmin` | Crear una nueva planta en el catálogo (con imagen) |
| PUT | `/plants/:id` | `isAdmin` | Actualizar información de una planta (con imagen) |
| DELETE| `/plants/:id` | `isAdmin` | Borrar una planta de la colección (operación administrativa)
| POST | `/plants/:id/addToUser` | `isAuth` | Añadir una planta a la colección del usuario actualmente logueado |

## Variables de entorno
Crear un archivo `.env` con al menos las siguientes variables:

- `DB_URL` — URI de conexión a MongoDB (ej. `mongodb://localhost:27017/thepower`)
- `JWT_SECRET` — clave para firmar tokens JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — si usas subida de imágenes

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
- El modelo `User` guarda referencias interconectadas relacionadas con la colección de plantas en el apartado de usuario.
- El script de seed se encarga de subir fotos e inertar hashes correctos de base de datos (`src/utils/seed.js`).
- Protegemos las rutas sensibles con `isAuth` y, cuando proceda, con comprobaciones de rol extra (`isAdmin`).

## Contact

David Pintado Morales

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)