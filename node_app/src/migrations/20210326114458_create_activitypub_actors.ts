import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apActors', (table) => {
    table.bigIncrements('id').primary();
    table.string('uri').unique().notNullable();
    table.string('username').notNullable();
    table.string('domain').nullable();
    table.text('actorType').notNullable();
    table.text('publicKey').notNullable();
    table.text('privateKey').nullable();
    table.text('inboxUrl').notNullable();
    table.text('outboxUrl').nullable();
    table.text('sharedInboxUrl').nullable();
    table.text('followersUrl').nullable();
    table.text('followingUrl').nullable();

    table.timestamps(false, true);
  });

  await knex.schema.alterTable('artistPages', (table) => {
    table
      .bigInteger('apActorId')
      .notNullable()
      .references('id')
      .inTable('apActors')
      .onDelete('CASCADE')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('artistPages', (table) => {
    table.dropColumn('apActorId');
  });

  await knex.schema.dropTableIfExists('apActors');
}
