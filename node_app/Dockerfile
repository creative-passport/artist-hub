FROM node:14-alpine as build

WORKDIR /home/node/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build


FROM node:14-alpine

# Install tini (init) so kernel interrupts work (Ctrl+C)
RUN apk add --no-cache tini

ENV NODE_ENV=production
WORKDIR /home/node/app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY --from=build /home/node/app/dist ./
RUN mkdir files && chown node:node files

EXPOSE 4000
USER node
CMD ["/sbin/tini", "node", "src/index.js"]
