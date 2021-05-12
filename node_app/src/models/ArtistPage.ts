import { Model, RelationMappings } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';
import { User } from './User';

/**
 * A database model representing an Artist Page
 */
export class ArtistPage extends BaseModel {
  id!: string;
  title!: string;
  username!: string;
  headline?: string;
  description?: string;

  user?: User;
  apActor!: APActor;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName(): string {
    return 'artistPages';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
  }

  static relationMappings = (): RelationMappings => ({
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
