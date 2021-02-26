# Getting Started with Artist Hub

## Configuration

You must first create a `node_app/.env` file. To get started copy the sample from `node_env/.env.sample`.
```
cp node_app/.env.example node_app/.env
```


## Authentication

Supported authentication methods are currently `oidc` (OpenID Connect) and `local` (Hardcoded username/password). Both can be configured using environment variables (or the `.env` file).

If you want to use OpenID Connect you can either use a hosted service such (e.g [Auth0](https://auth0.com/)) or run your own server (e.g. [Ory Hydra](https://www.ory.sh/hydra/)).

## Docker

The easiest way to get started is to use [Docker](https://docs.docker.com/get-docker/).

Simply run:
```
docker-compose up --build
```

This will start the server running on port 3000.

You can access this by visiting http://localhost:3000 in your browser.

## Development

### Node app

To run the node app in development mode you should install the latest LTS version of [Node.js](https://nodejs.org/en/) and then run the following commands:

1. `cd node_app`
2. `npm install`
3. `npm build`
4. `npm start`

### Web app

To run the web app in development mode you should install the latest LTS version of [Node.js](https://nodejs.org/en/) and then run the following commands:

1. `cd web_app`
2. `npm install`
3. `npm build`
4. `npm start`

## Copyright

Copyright (c) 2021 Creative Passport MTÜ. All rights reserved.
