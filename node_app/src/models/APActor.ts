import { Model } from 'objection';
import { APFollow } from './APFollow';
import { APObject } from './APObject';
import { ArtistPage } from './ArtistPage';
import { BaseModel } from './BaseModel';

export class APActor extends BaseModel {
  id!: string;
  uri!: string;
  url?: string;
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
  objects?: APObject[];
  deliveredObjects?: APObject[];

  followers?: APFollow[];
  following?: APFollow;

  followingActors?: APFollowActor[];

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'apActors';
  }

  acceptedFollowers = async (): Promise<APActor[]> => {
    const apFollows = await this.$relatedQuery('followers')
      .withGraphJoined('actorFollower')
      .where({ state: 'accepted' });
    return apFollows.map((f) => f.actorFollower);
  };

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
    followingActors: {
      relation: Model.ManyToManyRelation,
      modelClass: APActor,

      join: {
        from: 'apActors.id',
        to: 'apActors.id',
        through: {
          from: 'apFollows.actorId',
          to: 'apFollows.targetActorId',
          extra: { followState: 'state', followUri: 'uri' },
        },
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
    objects: {
      relation: Model.HasManyRelation,
      modelClass: APObject,

      join: {
        from: 'apActors.id',
        to: 'apObjects.actorId',
      },
    },
    deliveredObjects: {
      relation: Model.ManyToManyRelation,
      modelClass: APObject,
      join: {
        from: 'apActors.id',
        to: 'apObjects.id',
        through: {
          from: 'apActorsObjects.actorId',
          to: 'apActorsObjects.objectId',
        },
      },
    },
  });
}

export class APFollowActor extends APActor {
  followState!: string;
  followUri!: string;
}
