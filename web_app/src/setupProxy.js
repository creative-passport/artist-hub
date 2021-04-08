// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

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
  if (
    req.headers['sec-ch-ua'] !==
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
  ) {
    console.log('URL:', req.originalUrl);
    console.log('ACCEPT HEADER:', req.headers);
    console.log('BODY:', req.body);
  }
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
