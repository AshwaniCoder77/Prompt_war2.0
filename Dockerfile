# Stage 1: Build the frontend
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Ignore warnings and treat as success
ENV CI=false
RUN npm run build


# Stage 2: Setup the backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

EXPOSE 8080
ENV PORT=8080

CMD ["node", "backend/index.js"]
