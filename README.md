# Getting Started with Artist Hub

## Important notice

Artist Hub is a brand new project which is very early in development and is ready for basic testing. You can watch this repository to see the development process and you can try to use it but their are likely to be bugs and missing functionality.

## Current Progress

- [x] Authentication
- [x] Docker support
- [x] Admin
  - [x] Create Artist page
  - [x] Delete Artist page
  - [x] Follow ActivityPub data source
  - [x] Show followed data sources
  - [x] Delete followed data source
- [x] ActivityPub
  - [x] Generate public/private keys
  - [x] Webfinger
  - [x] Actor JSON-LD
    - [x] Avatars
    - [x] URL
    - [ ] Refresh actor data
  - [x] Send Follow request
  - [x] Inbox
    - [x] Shared Inbox
    - [x] Accept
    - [x] Reject
    - [x] Note
      - [x] Attachment
  - [x] Sign POST requests 
  - [x] Verify signatures 
  - [x] Validation
- [x] Public Artist Page
  - [x] Initial Placeholder
  - [x] Show ActivityPub data
- [x] Improve UI/UX
  - [x] Admin
  - [x] Homepage
  - [x] Artist Public page

## Configuration

You must first create a `node_app/.env` file. To get started copy the sample from `node_env/.env.sample`.
```sh
cp node_app/.env.example node_app/.env
```

You should then customise the environment variables in the `.env` file to configure authentication and set the cookie secret before you can start a server.

## Authentication

Supported authentication methods are currently `oidc` (OpenID Connect) and `local` (Hardcoded username/password). Both can be configured using environment variables (or the `.env` file).

If you want to use OpenID Connect you can either use a hosted service such (e.g [Auth0](https://auth0.com/)) or run your own server (e.g. [Ory Hydra](https://www.ory.sh/hydra/)).

## Quick-start server (using Docker)

The easiest way to get started is to use [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/).

We provide 3 compose files which can be used to get up and running quickly.

##### quickstart.yml
Base compose file. Will start a dev server on HTTP and uses an existing PostgreSQL server which you should configure in your `.env` file.

##### quickstart-postgres.yml
This compose file will create and run the required PostgreSQL server in a Docker container so you don't need to provide an existing PostgreSQL server. This file requires you to also include `quickstart.yml`.

##### quickstart-production.yml
This compose file will also serve the site using HTTPs and should be used with a real domain. It will use [Let's Encrypt](https://letsencrypt.org/) to acquire a TLS certificate.

These instructions below assume you are using the Docker provided PostgreSQL server.

On the first run or when updating run:
```sh
docker-compose -f quickstart.yml build
docker-compose -f quickstart.yml -f quickstart-postgres.yml run --rm node npm run knex -- migrate:latest
```

Then start the server with:
```sh
DOMAIN=localhost docker-compose -f quickstart.yml -f quickstart-postgres.yml up -d
```

This will start the server running on port 80.

You can access this by visiting http://localhost in your browser.

You may want to use these compose files as a basis to create your own compose file for deployment.

#### Production

For a production deployment you should change the `DOMAIN` to the domain name you are using and also include the `quickstart-production.yml` which uses [Caddy](https://caddyserver.com/) and [Let's Encrypt](https://letsencrypt.org/) to automatically enable HTTPS.

For example when using the provided PostgresSQL docker container:
```sh
DOMAIN=example.com docker-compose -f quickstart.yml -f quickstart-postgres.yml -f quickstart-production.yml up -d
```

Or if you used your own PostgresSQL server:
```sh
DOMAIN=example.com docker-compose -f quickstart.yml -f quickstart-production.yml up -d
```


### Stopping the server

```sh
docker-compose -f quickstart.yml -f quickstart-postgres.yml down
```
### Clean up

`docker-compose` will create volumes to store the Artist Hub database and any uploaded images. If you no longer need the data and want to delete it then run:

```sh
docker-compose -f quickstart.yml -f quickstart-postgres.yml down -v
```

## Development

### Documentation

The code the documented using TSDoc. You can generate documentation using [TypeDoc](https://typedoc.org/) by running:

```sh
npm run typedoc
```

### PostgreSQL Database

Artist Hub uses PostgreSQL as a data store. Artist Hub has been tested with PostgreSQL 12.x but should work with 10.x and later. You will need to create a database in PostgreSQL for Artist Hub and configure a database user with write access to that database.

https://www.postgresql.org/

These SQL commands would create a suitable user and database.

```sql
CREATE ROLE artisthub WITH LOGIN PASSWORD 'password';
CREATE DATABASE artisthub WITH OWNER artisthub;
```

### Node app

To run the node app in development mode you should install the latest LTS version of [Node.js](https://nodejs.org/en/).

You should then configure the `.env` file as described in the configuration section above. Make sure you configure the `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD` variables with the database settings:

e.g. 
```
PGDATABASE=artisthub
PGHOST=localhost
PGPORT=5432
PGUSER=artisthub
PGPASSWORD=password
```

Then run the following commands:

1. `cd node_app`
2. `npm install`
3. `npm build`
4. `npm run knex -- migrate:latest`
5. `npm start`

The node app uses [debug](https://github.com/visionmedia/debug) for debug logging. To enable all debug logging start the node app with `DEBUG=artisthub:* npm start`.

To run the tests for the node app run `npm test`.

### Web app

To run the web app in development mode you should install the latest LTS version of [Node.js](https://nodejs.org/en/) and then run the following commands:

1. `cd web_app`
2. `npm install`
3. `npm build`
4. `npm start`

You can now open the Artist Hub by visiting <http://localhost:3000> in your browser.

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
