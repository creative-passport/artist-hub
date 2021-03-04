import { Model } from 'objection';
import { TokenSet } from 'openid-client';

export class User extends Model {
  id!: string;
  sub!: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;

  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'users';
  }

  get tokenset() {
    return new TokenSet({
      id_token: this.idToken,
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      token_type: this.tokenType,
      expires_at: this.expiresAt,
    });
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
