FROM node:carbon

WORKDIR ./app

COPY ./ ./

RUN npm install -g npm-git-install
RUN npm install

ENV NODE_ENV="production"
CMD ["npm", "start"]