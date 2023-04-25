FROM node:18-alpine AS server
WORKDIR /app
COPY ./api/package* ./
RUN yarn install --production
COPY ./api .
RUN yarn build

CMD ["yarn", "start"]
