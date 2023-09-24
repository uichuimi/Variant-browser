FROM node:lts-alpine as production
ARG PROJECT
ARG ENVIRONMENT

WORKDIR /app

RUN echo $PROJECT
RUN echo $ENVIRONMENT

RUN addgroup --system $PROJECT && \
    adduser --system -G $PROJECT $PROJECT

COPY package.json .
COPY package-lock.json .
COPY decorate-angular-cli.js .
COPY ./dist/apps/$PROJECT $PROJECT

RUN npm install --omit=dev

RUN chown -R $PROJECT:$PROJECT .

CMD npx http-server $PROJECT -p 80
