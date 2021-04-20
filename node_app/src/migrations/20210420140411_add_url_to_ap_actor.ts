import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('apActors', (table) => {
    table.string('url').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('apActors', (table) => {
    table.dropColumn('url');
  });
}
