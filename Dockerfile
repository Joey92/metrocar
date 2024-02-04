FROM node:16-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install

COPY next-i18next.config.js next.config.js tsconfig.json ./

COPY public ./public
COPY src ./src

ENV NODE_ENV="production"

CMD yarn run build && yarn run start
