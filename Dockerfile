FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .


FROM node:18-alpine AS server
WORKDIR /app
COPY package* ./
RUN yarn install --production
EXPOSE 8080
CMD ["npm", "start"]