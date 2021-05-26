import { Model, RelationMappings } from 'objection';
import { APActor } from './APActor';
import { BaseModel } from './BaseModel';
import { User } from './User';
import path from 'path';

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
}
