FROM node:alpine3.18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

EXPOSE 80

COPY . .