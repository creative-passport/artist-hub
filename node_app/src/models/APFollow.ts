import { Model } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

type FollowState = 'pending' | 'accepted';

export class APFollow extends BaseModel {
  id!: string;
  uri!: string;
  state!: FollowState;
  actorId!: string;
  targetActorId!: string;

  actorFollower!: APActor;
  actorFollowing!: APActor;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'apFollows';
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static relationMappings = () => ({
    actorFollower: {
      relation: Model.BelongsToOneRelation,
      modelClass: APActor,

      join: {
        from: 'apFollows.actorId',
        to: 'apActors.id',
      },
    },
    actorFollowing: {
      relation: Model.BelongsToOneRelation,
      modelClass: APActor,

      join: {
        from: 'apFollows.targetActorId',
        to: 'apActors.id',
      },
    },
  });
}
