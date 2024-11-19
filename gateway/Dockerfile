FROM node:alpine3.18
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk update && apk add --no-cache curl
RUN npm ci
COPY . .