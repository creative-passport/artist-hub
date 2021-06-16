import { Model, RelationMappings } from 'objection';
import { APObject } from './APObject';
import { BaseModel } from './BaseModel';

/**
 * A database model representing an ActivityPub Attachment
 */
export class APAttachment extends BaseModel {
  id!: string;
  url!: string;
  type!: string;
  mediaType!: string;
  description?: string;
  thumbnailUrl?: string;
  blurhash?: string;

  object?: APObject;

  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'apAttachments';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
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
