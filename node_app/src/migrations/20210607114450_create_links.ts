import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('links', (table) => {
    table.bigIncrements('id').primary();
    table.integer('sort').notNullable();
    table.string('url').notNullable();

    table
      .bigInteger('artistPageId')
      .notNullable()
      .references('id')
      .inTable('artistPages')
      .onDelete('CASCADE')
      .index();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('links');
}
