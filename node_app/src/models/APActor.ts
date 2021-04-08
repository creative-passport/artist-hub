import { Model } from 'objection';
import { APFollow } from './APFollow';
import { ArtistPage } from './ArtistPage';
import { BaseModel } from './BaseModel';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export class APActor extends BaseModel {
  id!: string;
  uri!: string;
  username!: string;
  domain?: string;
  actorType!: string;
  publicKey!: string;
  privateKey!: string;
  inboxUrl!: string;
  outboxUrl?: string;
  sharedInboxUrl?: string;
  followersUrl?: string;
  followingUrl?: string;

  artistPage?: ArtistPage;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'apActors';
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static relationMappings = () => ({
    artistPage: {
      relation: Model.HasOneRelation,
      modelClass: ArtistPage,

      join: {
        from: 'apActors.id',
        to: 'artistPages.apActorId',
      },
    },
    following: {
      relation: Model.HasManyRelation,
      modelClass: APFollow,

      join: {
        from: 'apActors.id',
        to: 'apFollows.actorId',
      },
    },
    followers: {
      relation: Model.HasManyRelation,
      modelClass: APFollow,

      join: {
        from: 'apActors.id',
        to: 'apFollows.targetActorId',
      },
    },
  });
}
