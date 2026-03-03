
FROM node:20.16-alpine as build

# Accept environment name (e.g. production, staging)
ARG ENV=development
ENV ENV=$ENV
RUN echo "Building in $ENV mode"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy correct .env.{ENV} file to .env
COPY .env.$ENV .env.production

RUN npm run build

FROM nginx:1.19.7-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
