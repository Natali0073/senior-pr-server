FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
COPY index.js ./
COPY app ./app

RUN npm install
CMD npm run start