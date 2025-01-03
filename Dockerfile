FROM node:latest AS build

WORKDIR /app
COPY package*.json .
COPY decorate-angular-cli.js .4
COPY . .
RUN npm ci
RUN npm install -g @angular/cli
RUN npx nx run variant-browser:build:development

FROM node:latest

COPY --from=build /app/dist/apps/variant-browser /app
COPY server.js /app
WORKDIR /app
RUN npm install express

EXPOSE 80

CMD node /app/server.js
