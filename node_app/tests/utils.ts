import { User } from '../src/models/User';
import { Model } from 'objection';
import Knex from 'knex';
import knexConfig from '../src/knexfile';
import { SuperAgentTest } from 'supertest';
import crypto from 'crypto';

const dbConfig = knexConfig.testing;

// Create the database
async function createTestDatabase(database: string) {
  // Remove database from config
  const { database: _database, ...connection } = {
    ...dbConfig.connection,
  };
  const knex = Knex({
    ...dbConfig,
    connection,
  });
  try {
    await knex.raw(`DROP DATABASE IF EXISTS "${database}"`);
    await knex.raw(`CREATE DATABASE "${database}"`);
  } finally {
    await knex.destroy();
  }
}

// Migrate the database
async function migrateTestDatabase() {
  await Model.knex().migrate.latest();
}

// Drop the test database
async function dropTestDatabase(database: string) {
  // Remove database from config
  const { database: _database, ...connection } = {
    ...dbConfig.connection,
  };
  const knex = Knex({
    ...dbConfig,
    connection,
  });
  try {
    await knex.raw(`DROP DATABASE IF EXISTS ${database}`);
  } finally {
    knex.destroy();
  }
}

// Setup the database (create, migrate, returns cleanup function)
export async function setupDb(): Promise<() => Promise<void>> {
  const database = `${dbConfig.connection.database}_${crypto
    .randomBytes(10)
    .toString('hex')}`;
  await createTestDatabase(database);

  const { database: _database, ...connection } = {
    ...dbConfig.connection,
  };
  const knex = Knex({
    ...knexConfig.testing,
    connection: { ...connection, database },
  });
  Model.knex(knex);
  await migrateTestDatabase();

  return async () => {
    knex.destroy();
    await dropTestDatabase(database);
  };
}

export interface SeedData {
  users: User[];
}

// Add seed data to the database
export async function seedData(): Promise<SeedData> {
  const users = await User.query().insertGraphAndFetch(
    [
      {
        sub: 'admin',
        artistPages: [
          {
            title: 'Test Page',
            username: 'test',
            apActor: {
              uri: 'http://0.0.0.0:4000/p/test',
              username: 'test',
              actorType: 'Person',
              publicKey: 'test',
              privateKey: 'test',
              inboxUrl: 'http://0.0.0.0:4000/p/test/inbox',
            },
          },
          {
            title: 'Test Page 2',
            username: 'test2',
            headline: 'Page headline',
            description: 'Page description',
            apActor: {
              uri: 'http://0.0.0.0:4000/p/test2',
              username: 'test2',
              actorType: 'Person',
              publicKey: 'test',
              privateKey: 'test',
              inboxUrl: 'http://0.0.0.0:4000/p/test2/inbox',
              followingActors: [
                {
                  '#id': 'jane',
                  uri: 'https://example.com/user/jane',
                  domain: 'example.com',
                  name: 'Jane Bloggs',
                  username: 'jane',
                  actorType: 'Person',
                  publicKey: 'test',
                  privateKey: 'test',
                  inboxUrl: 'https://example.com/user/jane/inbox',
                  followState: 'accepted',
                  followUri: 'http://0.0.0.0:4000/activity/123456',
                },
              ],
              deliveredObjects: [
                {
                  actor: { '#ref': 'jane' },
                  uri: 'https://example.com/user/jane/1',
                  objectType: 'Note',
                  content: 'Test note',
                },
                {
                  actor: { '#ref': 'jane' },
                  uri: 'https://example.com/user/jane/2',
                  objectType: 'Note 2',
                  content: 'Another test note',
                  attachments: [
                    {
                      url: 'https://example.com/assets/image.png',
                      mediaType: 'image/png',
                      type: 'Document',
                      blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
                      description: 'Alt text',
                    },
                  ],
                },
              ],
            },
            links: [
              {
                sort: 1,
                url: 'https://example.com/1',
              },
              {
                sort: 2,
                url: 'https://example.com/2',
              },
            ],
          },
        ],
      },
    ],
    { allowRefs: true }
  );
  return {
    users,
  };
}

// Login a user
export async function login(agent: SuperAgentTest): Promise<void> {
  const {
    body: { csrfToken },
  } = await agent.get(`/auth`);
  await agent.post(`/auth/login`).type('form').send({
    _csrf: csrfToken,
    username: 'admin',
    password: 'admin',
  });
  agent.set('X-XSRF-TOKEN', csrfToken);
}
