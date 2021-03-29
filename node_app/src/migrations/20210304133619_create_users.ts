// import * as Knex from 'knex';

import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.string('sub').notNullable().unique();
    table.string('idToken', 8192);
    table.string('accessToken');
    table.string('refreshToken');
    table.string('tokenType');
    table.integer('expiresAt');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
