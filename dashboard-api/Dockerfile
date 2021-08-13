FROM node:16-alpine3.11

WORKDIR /api

COPY . ./
RUN npm -g install --silent npm@latest
RUN npm install --silent --legacy-peer-deps

CMD ["node", "index.js"]
