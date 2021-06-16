import { JSONSchema, Model, RelationMappings } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';
import { User } from './User';
import path from 'path';
import { Link } from './Link';

/**
 * A database model representing an Artist Page
 */
export class ArtistPage extends BaseModel {
  id!: string;
  title!: string;
  username!: string;
  headline?: string;
  description?: string;

  profileImageFilename?: string;
  coverImageFilename?: string;

  user?: User;
  apActor!: APActor;
  links?: Link[];

  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'artistPages';
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
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
    links: {
      relation: Model.HasManyRelation,
      modelClass: Link,

      join: {
        from: 'artistPages.id',
        to: 'links.artistPageId',
      },
    },
  });

  profileImageBasePath(): string {
    return path.join('files/artistPage/profileImage', this.id, 'original');
  }

  profileImagePath(): string | undefined {
    return this.profileImageFilename
      ? path.join(this.profileImageBasePath(), this.profileImageFilename)
      : undefined;
  }

  profileImageUrl(): string | undefined {
    return this.profileImageFilename
      ? path.join('/', this.profileImageBasePath(), this.profileImageFilename)
      : undefined;
  }

  coverImageBasePath(): string {
    return path.join('files/artistPage/coverImage', this.id, 'original');
  }

  coverImagePath(): string | undefined {
    return this.coverImageFilename
      ? path.join(this.coverImageBasePath(), this.coverImageFilename)
      : undefined;
  }

  coverImageUrl(): string | undefined {
    return this.coverImageFilename
      ? path.join('/', this.coverImageBasePath(), this.coverImageFilename)
      : undefined;
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['title', 'username'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        headline: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 8000 },
        profileImageFilename: { type: 'string', minLength: 1, maxLength: 255 },
        coverImageFilename: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
