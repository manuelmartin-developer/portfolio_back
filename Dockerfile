FROM node:18-alpine AS server
WORKDIR /app
COPY ./api/package* ./
RUN yarn install
COPY ./api .
RUN yarn build
EXPOSE 8080
CMD ["yarn", "start"]
