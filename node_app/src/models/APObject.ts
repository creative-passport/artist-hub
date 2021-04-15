import { Model } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';

export class APObject extends BaseModel {
  id!: string;
  uri!: string;
  url?: string;
  objectType!: string;
  actorId!: string;
  content?: string;

  actor?: APActor;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'apObjects';
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static relationMappings = () => ({
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
  });
}
