import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apActorsObjects', (table) => {
    table
      .bigInteger('actorId')
      .notNullable()
      .references('id')
      .inTable('apActors')
      .onDelete('CASCADE')
      .index();
    table
      .bigInteger('objectId')
      .notNullable()
      .references('id')
      .inTable('apObjects')
      .onDelete('CASCADE')
      .index();
    table.primary(['actorId', 'objectId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('apActorsObjects');
}
