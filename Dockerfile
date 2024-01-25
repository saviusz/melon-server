FROM node:lts

COPY . .

RUN npm ci
RUN npm run build

ENV NODE_ENV=development

EXPOSE 3000

CMD [ "npm", "run", "start" ]
