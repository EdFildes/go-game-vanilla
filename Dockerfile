FROM node:latest

WORKDIR /usr/app
COPY . /usr/app

RUN npm i
RUN npx tsc 

ENV NODE_ENV production

CMD [ "node","./build/main.js" ] 

EXPOSE 3000
