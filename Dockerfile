FROM node:latest

WORKDIR /usr/app
COPY . /usr/app

RUN npm i
RUN npx tsc 

CMD [ "node","./build/main.js" ] 

EXPOSE 3000
