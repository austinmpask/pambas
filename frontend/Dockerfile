FROM node:alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm install

EXPOSE 80

COPY . .