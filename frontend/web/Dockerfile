###
# Builder Image
###
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --omit=dev

# Copy sources (see .dockerignore)
COPY . .

# Set environment
ARG REACT_APP_HOST=localhost
ARG REACT_APP_PORT=3000
ARG REACT_APP_BACKEND_URL=http://localhost:8080

# Build source
RUN npm run build

###
# Production Image
###
FROM nginx:1.21.6-alpine AS app

# Set the working directory
WORKDIR /app

# Copy nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy code
COPY --from=builder /app/build /usr/share/nginx/html

# Inform port that the container listens on
EXPOSE 80

# Prefix commands and start production
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]