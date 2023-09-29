FROM httpd:alpine
ARG PROJECT
COPY dist/apps/$PROJECT /usr/local/apache2/htdocs/
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
