### STAGE 1: Build ###
FROM node:16.0 as builder
# set ENV variables
ENV NODE_ENV production
ENV REACT_APP_API_URL https://aire.comiteecologicointegral.org/api
# create a workspace dir for building the app
WORKDIR /usr/src/app
# copy package.json, used to install dependences in the next step
COPY package*.json ./
# install dependencies
RUN npm install
# copy source code inside the container's workdir
COPY . .
# start the build of the app
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.19.7-alpine
# copy the custom nginx configuration file
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
# copy app build files to nginx webroot folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html