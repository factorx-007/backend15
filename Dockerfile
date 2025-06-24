# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./


# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación (si es necesario)
# RUN npm run build

# Etapa de producción
FROM node:18-alpine

# Instalar netcat para el script wait-for-it
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copiar dependencias y código construido desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ ./

# Hacer el script ejecutable
RUN chmod +x /app/wait-for-it.sh

# Puerto de la aplicación
EXPOSE 3000

# Comando de inicio: espera la base de datos y luego ejecuta la app (expansión de variables habilitada)
CMD /app/wait-for-it.sh "$DB_HOST:$DB_PORT" -- npm run start
