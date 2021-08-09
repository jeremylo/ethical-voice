FROM node:16-alpine3.11

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

COPY . ./
RUN npm -g install --silent npm@latest
RUN npm install --silent --legacy-peer-deps

RUN npm run build
