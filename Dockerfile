FROM node:12-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

RUN yarn install

COPY . /usr/src/app

EXPOSE 4678 9229
