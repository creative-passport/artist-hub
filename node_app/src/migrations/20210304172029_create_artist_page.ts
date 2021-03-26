import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('artistPages', (table) => {
    table.bigIncrements('id').primary();
    table.string('title').notNullable();
    table.string('username').unique().notNullable();
    table.text('publicKey').notNullable();
    table.text('privateKey').notNullable();

    table
      .bigInteger('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('artistPages');
}
