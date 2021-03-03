# Getting Started with Artist Hub

## Important notice

Artist Hub is a brand new project which is very early in development and **at the current stage is not ready to be used**. You can watch this repository to see the development process but if you try to use it now you will find most of the functionality is not available.

## Current Progress

- [x] Authentication
- [x] Docker support

## Configuration

You must first create a `node_app/.env` file. To get started copy the sample from `node_env/.env.sample`.
```
cp node_app/.env.example node_app/.env
```

You should then customise the environment variables in the `.env` file to configure authentication and set the cookie secret before you can start a server.

## Authentication

Supported authentication methods are currently `oidc` (OpenID Connect) and `local` (Hardcoded username/password). Both can be configured using environment variables (or the `.env` file).

If you want to use OpenID Connect you can either use a hosted service such (e.g [Auth0](https://auth0.com/)) or run your own server (e.g. [Ory Hydra](https://www.ory.sh/hydra/)).

## Start server (using Docker)

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

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
