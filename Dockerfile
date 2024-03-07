FROM node:latest

RUN npm i
RUN npx tsc 
RUN node ./build/main.js

EXPOSE 3000
