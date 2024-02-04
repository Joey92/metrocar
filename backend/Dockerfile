FROM node:16-alpine as base
RUN apk add openssl

WORKDIR /app

RUN mkdir -p /keys && openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -outform PEM -pubout -out public.pem && mv *.pem /keys && chown -R node /keys
ENV JWT_PUBLIC_KEY="/keys/public.pem" JWT_PRIVATE_KEY="/keys/private.pem"

FROM base as build
# needed for node-argon2
RUN apk add python3 gcc
RUN npm install -g node-gyp

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.* ./
COPY proto ./proto
COPY src ./src

RUN npm run build
COPY locales ./locales

FROM build as pruned

RUN npm prune --production

FROM base as app

ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY --from=build /app/build .
COPY --from=pruned /app/node_modules ./node_modules/

EXPOSE 8080

USER node
CMD node src/main.js
