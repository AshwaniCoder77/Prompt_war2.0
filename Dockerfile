# Base image
FROM node:18

WORKDIR /app

# Copy everything
COPY . .

# Build frontend
RUN cd frontend && npm install && npm run build

# Build backend
RUN cd backend && npm install --production

# Move to backend for startup
WORKDIR /app/backend

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "index.js"]


