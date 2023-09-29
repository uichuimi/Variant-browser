FROM nginx:alpine
ARG PROJECT
COPY dist/apps/$PROJECT /usr/share/nginx/html
