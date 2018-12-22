# base image
FROM node:9.11.1

# set working directory
RUN mkdir /client
WORKDIR /client

# add `/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /client/package.json
RUN npm install
RUN npm install -g @angular/cli@1.7.1

# add app
COPY . /client

# start app
CMD ng serve --host 0.0.0.0 --disable-host-check
