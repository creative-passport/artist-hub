FROM node:14-alpine

# Install tini (init) so kernel interrupts work (Ctrl+C)
RUN apk add --no-cache tini

WORKDIR /home/node/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build
RUN mkdir files && chown node:node files

EXPOSE 4000
USER node
CMD ["/sbin/tini", "node", "dist/src/index.js"]
