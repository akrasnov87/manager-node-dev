FROM ubuntu:22.04 as build

RUN apt update && apt upgrade -y
ARG DEBIAN_FRONTEND=noninteractive TZ=Europe/Moscow

RUN apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

RUN apt install nodejs  -y

WORKDIR /app
COPY . /app

RUN npm install

FROM node:20-alpine

WORKDIR /opt/app

COPY --from=build /app /opt/app

EXPOSE 3000
VOLUME /opt/app/logs

ENTRYPOINT ["node"]
CMD ["/opt/app/bin/www"]