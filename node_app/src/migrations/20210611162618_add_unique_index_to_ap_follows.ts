import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('apFollows', (table) => {
    table.unique(['actorId', 'targetActorId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('apFollows', (table) => {
    table.dropUnique(['actorId', 'targetActorId']);
  });
}
