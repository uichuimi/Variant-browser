FROM httpd:alpine
ARG PROJECT
COPY dist/apps/$PROJECT /usr/local/apache2/htdocs/
