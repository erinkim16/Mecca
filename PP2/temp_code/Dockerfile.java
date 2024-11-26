FROM openjdk:8-jdk-alpine
RUN mkdir -p /app && chmod -R 777 /app
WORKDIR /app
COPY . /app