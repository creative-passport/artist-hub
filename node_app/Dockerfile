FROM node:14.15.5

# Install tini (init) so kernel interrupts work (Ctrl+C)
ENV TINI_VERSION="0.19.0"
RUN dpkgArch="$(dpkg --print-architecture)" && \
	ARCH=$dpkgArch && \
	wget https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini-$ARCH \
	https://github.com/krallin/tini/releases/download/v${TINI_VERSION}/tini-$ARCH.sha256sum && \
	cat tini-$ARCH.sha256sum | sha256sum -c - && \
	mv tini-$ARCH /tini && rm tini-$ARCH.sha256sum && \
	chmod +x /tini

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

EXPOSE 4000
USER node
CMD ["/tini", "node", "dist/index.js"]
