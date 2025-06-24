# Backend para Sistema de Farmacia

Este es el backend para un sistema de gestión de farmacia, desarrollado con Node.js, Express, Sequelize y PostgreSQL.

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Configuración Inicial

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Configura las variables de conexión a la base de datos en el archivo `.env`

   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DB_NAME=farmacia_db
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=5432

   # JWT (para autenticación)
   JWT_SECRET=tu_clave_secreta_jwt
   JWT_EXPIRES_IN=24h
   ```

4. Crea la base de datos en PostgreSQL:
   ```sql
   CREATE DATABASE farmacia_db;
   ```

5. Ejecuta las migraciones (si es necesario):
   ```bash
   npx sequelize-cli db:migrate
   ```

## Ejecutar la Aplicación

### Modo Desarrollo

```bash
# Usando npm
npm run dev

# O usando yarn
yarn dev
```

### Modo Producción

```bash
# Compilar (si es necesario)
npm run build

# Iniciar servidor
npm start
```

## Estructura del Proyecto

```
src/
├── config/               # Archivos de configuración
│   └── database.js       # Configuración de la base de datos
├── controllers/          # Controladores de la API
├── middlewares/          # Middlewares de Express
├── models/               # Modelos de Sequelize
├── routes/               # Rutas de la API
├── services/             # Lógica de negocio
└── utils/                # Utilidades y helpers
```

## Documentación de la API

La API sigue el estándar REST y está documentada con OpenAPI (Swagger). Para ver la documentación:

1. Inicia el servidor
2. Abre `http://localhost:3000/api-docs` en tu navegador

## Endpoints Principales

### Especialidades
- `GET /api/especialidades` - Obtener todas las especialidades
- `GET /api/especialidades/:id` - Obtener una especialidad por ID
- `POST /api/especialidades` - Crear una nueva especialidad
- `PUT /api/especialidades/:id` - Actualizar una especialidad
- `DELETE /api/especialidades/:id` - Eliminar una especialidad

### Tipos de Medicamento
- `GET /api/tipos-medicamento` - Obtener todos los tipos de medicamento
- `GET /api/tipos-medicamento/:id` - Obtener un tipo de medicamento por ID
- `POST /api/tipos-medicamento` - Crear un nuevo tipo de medicamento
- `PUT /api/tipos-medicamento/:id` - Actualizar un tipo de medicamento
- `DELETE /api/tipos-medicamento/:id` - Eliminar un tipo de medicamento

### Laboratorios
- `GET /api/laboratorios` - Obtener todos los laboratorios
- `GET /api/laboratorios/:id` - Obtener un laboratorio por ID
- `POST /api/laboratorios` - Crear un nuevo laboratorio
- `PUT /api/laboratorios/:id` - Actualizar un laboratorio
- `DELETE /api/laboratorios/:id` - Eliminar un laboratorio

### Medicamentos
- `GET /api/medicamentos` - Obtener todos los medicamentos
- `GET /api/medicamentos/buscar?termino=...` - Buscar medicamentos por término
- `GET /api/medicamentos/:id` - Obtener un medicamento por ID
- `POST /api/medicamentos` - Crear un nuevo medicamento
- `PUT /api/medicamentos/:id` - Actualizar un medicamento
- `DELETE /api/medicamentos/:id` - Eliminar un medicamento

### Órdenes de Venta
- `GET /api/ordenes-venta` - Obtener todas las órdenes de venta
- `GET /api/ordenes-venta/:id` - Obtener una orden de venta por ID
- `POST /api/ordenes-venta` - Crear una nueva orden de venta
- `PUT /api/ordenes-venta/:id/estado` - Actualizar el estado de una orden de venta
- `DELETE /api/ordenes-venta/:id` - Eliminar una orden de venta (solo si está pendiente)

### Órdenes de Compra
- `GET /api/ordenes-compra` - Obtener todas las órdenes de compra
- `GET /api/ordenes-compra/:id` - Obtener una orden de compra por ID
- `POST /api/ordenes-compra` - Crear una nueva orden de compra
- `PUT /api/ordenes-compra/:id/estado` - Actualizar el estado de una orden de compra
- `DELETE /api/ordenes-compra/:id` - Eliminar una orden de compra (solo si está pendiente)

## Variables de Entorno

| Variable         | Descripción                                | Valor por Defecto |
|------------------|--------------------------------------------|-------------------|
| PORT             | Puerto del servidor                        | 3000              |
| NODE_ENV         | Entorno de ejecución                      | development       |
| DB_NAME          | Nombre de la base de datos                | farmacia_db       |
| DB_USER          | Usuario de la base de datos               | -                 |
| DB_PASSWORD      | Contraseña de la base de datos            | -                 |
| DB_HOST          | Host de la base de datos                  | localhost         |
| DB_PORT          | Puerto de la base de datos                | 5432              |
| JWT_SECRET       | Clave secreta para JWT                    | -                 |
| JWT_EXPIRES_IN   | Tiempo de expiración del token JWT        | 24h               |

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
# o
yarn test
```

## Despliegue

### Docker

Puedes desplegar la aplicación usando Docker:

```bash
# Construir la imagen
docker build -t farmacia-backend .

# Ejecutar el contenedor
docker run -p 3000:3000 --env-file .env farmacia-backend
```

### Plataformas en la Nube

- **Heroku**: Configura un nuevo proyecto y conecta tu repositorio
- **AWS Elastic Beanstalk**: Crea un nuevo entorno y despliega la aplicación
- **Google Cloud Run**: Despliega la aplicación como un servicio sin servidor

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu_usuario](https://twitter.com/tu_usuario)

Enlace del Proyecto: [https://github.com/tu_usuario/farmacia-backend](https://github.com/tu_usuario/farmacia-backend)
