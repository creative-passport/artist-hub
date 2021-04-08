import { Knex } from 'knex';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('apFollows', (table) => {
    table.bigIncrements('id').primary();
    table
      .enu('state', ['pending', 'accepted'], {
        useNative: true,
        enumName: 'follow_state_type',
      })
      .notNullable();
    table.string('uri').unique().notNullable();
    table
      .bigInteger('actorId')
      .notNullable()
      .references('id')
      .inTable('apActors')
      .onDelete('CASCADE')
      .index();
    table
      .bigInteger('targetActorId')
      .notNullable()
      .references('id')
      .inTable('apActors')
      .onDelete('CASCADE')
      .index();

    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('apFollows');
  await knex.raw('DROP TYPE IF EXISTS follow_state_type');
}
