import { Model, RelationMappings } from 'objection';
import { APObject } from './APObject';
import { BaseModel } from './BaseModel';

export class APAttachment extends BaseModel {
  id!: string;
  url!: string;
  type!: string;
  mediaType!: string;
  description?: string;
  thumbnailUrl?: string;
  blurhash?: string;

  object?: APObject;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName(): string {
    return 'apAttachments';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
  }

  static relationMappings = (): RelationMappings => ({
    object: {
      relation: Model.BelongsToOneRelation,
      modelClass: APObject,

      join: {
        from: 'apAttachments.apObjectId',
        to: 'apObjects.id',
      },
    },
  });
}
