FROM node:9.11.1

RUN mkdir /api
WORKDIR /api

COPY package.json /api/package.json
RUN npm install -g npm-git-install
RUN npm install

COPY . /api

ENV NODE_ENV="production"

CMD ["npm", "start"]