FROM node:18-alpine AS server
WORKDIR /app
COPY ./portfolio_back/package* ./
RUN yarn install
COPY ./api .
EXPOSE 8082
CMD ["yarn", "start"]
