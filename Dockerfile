FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE ${API_PORT}
CMD npm run start