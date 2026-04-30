# Base image
FROM node:18

WORKDIR /app

# Copy everything
COPY . .

# Build frontend
RUN cd frontend && npm install && npm run build

# Build backend
RUN cd backend && npm install --production

# Environment settings
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "backend/index.js"]

