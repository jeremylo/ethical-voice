FROM node:16-alpine3.11

ENV NODE_ENV=production

WORKDIR /dashboard-api

COPY . ./
RUN npm -g install --silent npm@latest
RUN npm install --silent --legacy-peer-deps

CMD ["node", "index.js"]
