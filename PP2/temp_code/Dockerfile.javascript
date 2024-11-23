FROM node:16-alpine
WORKDIR /app
COPY . /app
CMD ["node", "your_code.js"]
