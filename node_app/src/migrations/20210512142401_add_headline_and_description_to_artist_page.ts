import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('artistPages', (table) => {
    table.string('headline').nullable();
    table.text('description').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('artistPages', (table) => {
    table.dropColumn('headline');
    table.dropColumn('description');
  });
}
