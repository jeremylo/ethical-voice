FROM node:16-alpine3.11

WORKDIR /app

COPY . ./
RUN npm -g install npm@latest
RUN npm install --silent

CMD ["npm", "build"]
