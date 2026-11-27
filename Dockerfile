FROM node:22-alpine
WORKDIR /app
COPY package.json server.mjs index.html style.css ./
COPY src ./src
USER node
CMD ["node","server.mjs"]
