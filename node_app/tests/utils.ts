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
  await Model.knex().migrate.latest({
    directory: './src/migrations',
  });
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

// Add seed data to the database
export async function seedData(): Promise<void> {
  const now = new Date().toISOString();

  await User.query().insertGraph([
    {
      sub: 'admin',
      createdAt: now,
      updatedAt: now,
      artistPages: [
        {
          title: 'Test Page',
          username: 'test',
          createdAt: now,
          updatedAt: now,
          apActor: {
            uri: '123556',
            username: 'test',
            actorType: 'test',
            publicKey: 'test',
            privateKey: 'test',
            inboxUrl: 'test',
            createdAt: now,
            updatedAt: now,
          },
        },
      ],
    },
  ]);
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
