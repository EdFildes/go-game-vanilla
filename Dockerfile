FROM node:latest

WORKDIR /usr/app
COPY . /usr/app

RUN npm i pm2 -g
RUN npm i
RUN npx tsc 

ENV NODE_ENV production

CMD [ "pm2-runtime","./build/main.js" ] 

EXPOSE 3000
