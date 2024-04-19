FROM node:alpine3.18
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install
COPY ./src .

CMD ["npm", "run", "dev"]