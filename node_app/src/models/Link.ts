import { JSONSchema, Model, RelationMappings } from 'objection';
import { ArtistPage } from './ArtistPage';
import { BaseModel } from './BaseModel';

/**
 * A database model representing an ActivityPub Attachment
 */
export class Link extends BaseModel {
  id!: string;
  sort!: number;
  url!: string;

  artistPage?: ArtistPage;

  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'links';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }

  static relationMappings = (): RelationMappings => ({
    artistPage: {
      relation: Model.BelongsToOneRelation,
      modelClass: ArtistPage,

      join: {
        from: 'links.artistPageId',
        to: 'artistPage.id',
      },
    },
  });

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['sort', 'url'],
      properties: {
        id: { type: 'string' },
        sort: { type: 'integer' },
        url: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          format: 'url',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
