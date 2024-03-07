FROM node:20-alpine as base

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install

FROM base as build

COPY . .
RUN npm run build

FROM --platform=linux/amd64 node:20-alpine as production

COPY --from=build /app/dist /dist
COPY tsconfig.json /dist
COPY package.json /dist
WORKDIR /dist

RUN npm install --omit=dev
EXPOSE 80

CMD [ "node", "main.js" ]