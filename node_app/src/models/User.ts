import { Model, RelationMapping } from 'objection';
import { ArtistPage } from './ArtistPage';
import { TokenSet } from 'openid-client';
import { BaseModel } from './BaseModel';

export class User extends BaseModel {
  id!: string;
  sub!: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;

  artistPages?: ArtistPage[];

  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'users';

  get tokenset() {
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

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static relationMappings = () => ({
    artistPages: {
      relation: Model.HasManyRelation,
      modelClass: ArtistPage,
      join: {
        from: 'users.id',
        to: 'artistPages.userId',
      },
    },
  });
}
