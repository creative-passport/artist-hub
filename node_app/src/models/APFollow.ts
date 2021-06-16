import { Model, RelationMappings } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';

type FollowState = 'pending' | 'accepted';

/**
 * A database model representing an ActivityPub Follow
 */
export class APFollow extends BaseModel {
  id!: string;
  uri!: string;
  state!: FollowState;
  actorId!: string;
  targetActorId!: string;

  actorFollower!: APActor;
  actorFollowing!: APActor;

  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'apFollows';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }

  static relationMappings = (): RelationMappings => ({
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
