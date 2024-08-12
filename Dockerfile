FROM node:20.16-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG ENV=development
ENV NODE_ENV=$ENV

RUN npm run build

FROM nginx:1.19.7-alpine

COPY --from=build app/build /usr/share/nginx/html

ADD nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
