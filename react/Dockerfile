FROM node:alpine3.18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && rm -rf /node_modules/react-awesome-button/dist

EXPOSE 80

COPY ./btn_build/dist /node_modules/react-awesome-button
COPY . .