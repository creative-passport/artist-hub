# Getting Started with Artist Hub

## Important notice

Artist Hub is a brand new project which is very early in development and **at the current stage is not ready to be used**. You can watch this repository to see the development process but if you try to use it now you will find most of the functionality is not available.

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
    - [ ] Avatars
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
  - [ ] Verify signatures 
  - [ ] Validation
- [x] Public Artist Page
  - [x] Initial Placeholder
  - [x] Show ActivityPub data
- [ ] Improve UI/UX
  - [ ] Admin
  - [ ] Homepage
  - [ ] Artist Public page

## Configuration

You must first create a `node_app/.env` file. To get started copy the sample from `node_env/.env.sample`.
```sh
cp node_app/.env.example node_app/.env
```

You should then customise the environment variables in the `.env` file to configure authentication and set the cookie secret before you can start a server.

## Authentication

Supported authentication methods are currently `oidc` (OpenID Connect) and `local` (Hardcoded username/password). Both can be configured using environment variables (or the `.env` file).

If you want to use OpenID Connect you can either use a hosted service such (e.g [Auth0](https://auth0.com/)) or run your own server (e.g. [Ory Hydra](https://www.ory.sh/hydra/)).

## Start server (using Docker)

The easiest way to get started is to use [Docker](https://docs.docker.com/get-docker/).

On the first run or when updating run:
```sh
docker-compose build
docker-compose run --rm node npm run knex -- migrate:latest
```

The start the server with:
```sh
docker-compose up
```



This will start the server running on port 3000.

You can access this by visiting http://localhost:3000 in your browser.

### Clean up

`docker-compose` will create a volume to store the Artist Hub database. If you no longer need the data and want to delete it then run:

```sh
docker-compose down -v
```

## Development


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

You should then configure the `.env` file as described in the configuration section above. Make sure you configure the `PG_CONNECTION_STRING` with the database settings:

e.g. `PG_CONNECTION_STRING=postgresql://artisthub:password@localhost:5432/artisthub`

Then run the following commands:

1. `cd node_app`
2. `npm install`
3. `npm build`
4. `npm run knex -- migrate:latest`
5. `npm start`

The node app uses [debug](https://github.com/visionmedia/debug) for debug logging. To enable all debug logging start the node app with `DEBUG=artisthub:* npm start`.

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
