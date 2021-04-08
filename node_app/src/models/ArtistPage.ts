import { Model } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';
import { User } from './User';

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