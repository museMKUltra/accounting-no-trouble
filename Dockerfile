FROM node:14.16.0-alpine3.13

WORKDIR /app
COPY ./server/package*.json .
RUN npm install
COPY ./client ./client
ENV REACT_APP_OAUTH_URL=http://localhost
RUN npm run build
COPY ./server .
EXPOSE 80
CMD ["npm", "start"]