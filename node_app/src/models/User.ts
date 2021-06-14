import { Model, RelationMappings, JSONSchema } from 'objection';
import { ArtistPage } from './ArtistPage';
import { TokenSet } from 'openid-client';
import { BaseModel } from './BaseModel';

/**
 * A database model representing a user
 */
export class User extends BaseModel {
  id!: string;
  sub!: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;

  artistPages?: ArtistPage[];

  createdAt!: string;
  updatedAt!: string;

  static tableName = 'users';

  get tokenset(): TokenSet | undefined {
    if (this.accessToken) {
      return new TokenSet({
        id_token: this.idToken,
        access_token: this.accessToken,
        refresh_token: this.refreshToken,
        token_type: this.tokenType,
        expires_at: this.expiresAt,
      });
    } else {
      return undefined;
    }
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }

  static relationMappings = (): RelationMappings => ({
    artistPages: {
      relation: Model.HasManyRelation,
      modelClass: ArtistPage,
      join: {
        from: 'users.id',
        to: 'artistPages.userId',
      },
    },
  });

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['sub', 'idToken'],
      properties: {
        id: { type: 'string' },
        sub: { type: 'string', minLength: 1, maxLength: 255 },
        idToken: { type: 'string', minLength: 1, maxLength: 8192 },
        accessToken: { type: 'string', minLength: 1, maxLength: 255 },
        refreshToken: { type: 'string', minLength: 1, maxLength: 255 },
        tokenType: { type: 'string', minLength: 1, maxLength: 255 },
        expiresAt: { type: 'integer' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
