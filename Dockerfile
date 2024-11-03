FROM node:20.16-alpine

WORKDIR /app/tracker-list

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]