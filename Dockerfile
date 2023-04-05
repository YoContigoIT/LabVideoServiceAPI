##############
# PRODUCTION #
##############

FROM --platform=linux/amd64 node:18-alpine As PRODUCTION

RUN npm install -g ts-node @nestjs/cli 

WORKDIR /usr/src/api

COPY package*.json ./

COPY . .

RUN npm install

ARG NODE_ENV=production

RUN npm run build 

COPY ./src/utilities/env ./dist/env

CMD [ "dumb-init", "NODE_ENV=production", "node", "dist/main" ]
