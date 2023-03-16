##############
# PRODUCTION #
##############

FROM --platform=linux/amd64 node:18 As PRODUCTION

RUN npm install -g ts-node @nestjs/cli 

WORKDIR /usr/src/api

COPY package*.json ./

COPY . .

RUN npm install

ARG NODE_ENV=production

# Domain name or ip where the API is running
ENV HTTP_HOST_IP=localhost

RUN npm run build 

COPY ./src/utilities/env ./dist/env

CMD [ "npm", "start" ]
