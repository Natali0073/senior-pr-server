FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
COPY index.js ./
COPY app ./app

RUN npm install
EXPOSE 8080
CMD npm run start