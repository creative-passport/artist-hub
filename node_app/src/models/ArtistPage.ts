import { Model } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';
import { User } from './User';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export class ArtistPage extends BaseModel {
  id!: string;
  title!: string;
  username!: string;

  user?: User;
  apActor!: APActor;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'artistPages';
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,

      join: {
        from: 'artistPages.userId',
        to: 'users.id',
      },
    },
    apActor: {
      relation: Model.BelongsToOneRelation,
      modelClass: APActor,

      join: {
        from: 'artistPages.apActorId',
        to: 'apActors.id',
      },
    },
  });
}
