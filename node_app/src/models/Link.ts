import { Model, RelationMappings } from 'objection';
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

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName(): string {
    return 'links';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date();
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
}
