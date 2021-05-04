import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apAttachments', (table) => {
    table.bigIncrements('id').primary();
    table
      .bigInteger('apObjectId')
      .notNullable()
      .references('id')
      .inTable('apObjects')
      .onDelete('CASCADE')
      .index();
    table.string('url').notNullable();
    table.string('thumbnailUrl').nullable();
    table.string('description').nullable();
    table.string('type').notNullable();
    table.string('mediaType').notNullable();
    table.string('blurhash').nullable();

    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('apAttachments');
}
