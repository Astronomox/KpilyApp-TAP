FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/types ./packages/types
COPY packages/api ./packages/api

RUN npm ci

WORKDIR /app/packages/api
RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]
