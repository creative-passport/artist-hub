const { createProxyMiddleware } = require('http-proxy-middleware');

const activityPubMimeTypes = [
  'application/ld+json',
  'application/activity+json',
];

const middlewareOptions = {
  target: 'http://localhost:4000',
  changeOrigin: true,
};

const filter = function (_pathname, req) {
  return (
    (req.method === 'GET' &&
      req.headers.accept &&
      activityPubMimeTypes.some((h) => req.headers.accept.includes(h))) ||
    (req.method === 'POST' &&
      req.headers['content-type'] &&
      activityPubMimeTypes.some((h) => req.headers['content-type'].includes(h)))
  );
};

const proxyMiddleware = createProxyMiddleware(middlewareOptions);

module.exports = function (app) {
  // Proxy all requests with Activity Streams mime type as these responses can't be generated client side
  app.use('/', createProxyMiddleware(filter, middlewareOptions));
  // Proxy webfinger, /api and /auth endpoints to NodeJS
  app.use('/.well-known/webfinger', proxyMiddleware);
  app.use('/api', proxyMiddleware);
  app.use('/auth', proxyMiddleware);
};
