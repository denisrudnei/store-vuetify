FROM ubuntu:latest

SHELL [ "/bin/bash" , "-c"]

RUN mkdir /opt/e_commerce

WORKDIR /opt/e_commerce

COPY ./ /opt/e_commerce/

RUN apt-get update
RUN apt-get -yqq install build-essential nodejs npm
RUN npm install
RUN npm run build

EXPOSE 80

ARG PORT=80
ARG HOST=0.0.0.0

CMD npm run start