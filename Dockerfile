FROM node:14.16.0-alpine3.13

WORKDIR /app
COPY package*.json .
RUN npm install
COPY .env .
COPY ./client ./client
ENV REACT_APP_OAUTH_URL=https://accounting-no-trouble.onrender.com
RUN npm run build
COPY . .
EXPOSE 80
CMD ["npm", "run", "production"]