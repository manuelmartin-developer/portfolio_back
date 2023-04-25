FROM node:18-alpine AS server
WORKDIR /app
COPY ./api/package* ./
RUN yarn install --production
EXPOSE 8080
CMD ["npm", "start"]