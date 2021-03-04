import { Model } from 'objection';
import { BaseModel } from './BaseModel';
import { User } from './User';

export class ArtistPage extends BaseModel {
  id!: string;
  name!: string;

  user?: User;

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
  });
}
