import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apObjects', (table) => {
    table.bigIncrements('id').primary();
    table.string('uri').unique().notNullable();
    table.string('objectType').notNullable();
    table
      .bigInteger('actorId')
      .notNullable()
      .references('id')
      .inTable('apActors')
      .onDelete('CASCADE')
      .index();
    table.string('url').nullable();
    table.text('content').nullable();

    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('apObjects');
}
