FROM node:20-alpine3.17
WORKDIR /app
COPY . .
RUN npm install && npm install peerjs && npm install qrcode
EXPOSE 3000
CMD ["node", "app.js"]