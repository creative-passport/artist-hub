const { createProxyMiddleware } = require('http-proxy-middleware');

const activityPubMimeTypes = [
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
  'application/activity+json',
];

const middlewareOptions = {
  target: 'http://localhost:4000',
  changeOrigin: true,
};

const filter = function (_pathname, req) {
  return (
    (req.method === 'GET' &&
      activityPubMimeTypes.includes(req.headers.accept)) ||
    (req.method === 'POST' &&
      activityPubMimeTypes.includes(req.headers['content-type']))
  );
};

module.exports = function (app) {
  // Proxy all requests with Activity Streams mime type as these responses can't be generated client side
  app.use('/', createProxyMiddleware(filter, middlewareOptions));

  // Proxy /api and /auth endpoints to NodeJS
  app.use('/api', createProxyMiddleware(middlewareOptions));
  app.use('/auth', createProxyMiddleware(middlewareOptions));
};
