import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('artistPages', (table) => {
    table.string('profileImageFilename').nullable();
    table.string('coverImageFilename').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('artistPages', (table) => {
    table.dropColumn('profileImageFilename');
    table.dropColumn('coverImageFilename');
  });
}
