import { Model, RelationMappings } from 'objection';
import { APActor } from './APActor';
import { APAttachment } from './APAttachment';
import { BaseModel } from './BaseModel';

/**
 * A database model representing a delivered ActivityPub Object such as a Note
 */
export class APObject extends BaseModel {
  id!: string;
  uri!: string;
  url?: string;
  objectType!: string;
  actorId!: string;
  content?: string;

  actor?: APActor;
  attachments?: APAttachment[];

  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'apObjects';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }

  static relationMappings = (): RelationMappings => ({
    deliveredActors: {
      relation: Model.ManyToManyRelation,
      modelClass: APActor,
      join: {
        from: 'apObjects.id',
        to: 'apActors.id',
        through: {
          from: 'apActorsObjects.objectId',
          to: 'apActorsObjects.actorId',
        },
      },
    },
    actor: {
      relation: Model.BelongsToOneRelation,
      modelClass: APActor,

      join: {
        from: 'apObjects.actorId',
        to: 'apActors.id',
      },
    },
    attachments: {
      relation: Model.HasManyRelation,
      modelClass: APAttachment,

      join: {
        from: 'apObjects.id',
        to: 'apAttachments.apObjectId',
      },
    },
  });
}
