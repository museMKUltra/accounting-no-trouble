FROM node:14.16.0-alpine3.13

WORKDIR /app
COPY package*.json .
RUN npm install
COPY ./client ./client
RUN npm run build
COPY . .
EXPOSE 80
CMD ["npm", "start"]