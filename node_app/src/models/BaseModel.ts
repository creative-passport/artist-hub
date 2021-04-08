import {
  Model,
  QueryBuilder,
  Constructor,
  TransactionOrKnex,
  Page,
} from 'objection';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

// A custom query builder that will always throw an error if nothing is found
// unless explicitly disabled with allowNotFound

export class MyQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
> {
  ArrayQueryBuilderType!: MyQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: MyQueryBuilder<M, M>;
  NumberQueryBuilderType!: MyQueryBuilder<M, number>;
  PageQueryBuilderType!: MyQueryBuilder<M, Page<M>>;

  private _allowNotFound = false;

  // Don't throw an error if not found
  allowNotFound() {
    this._allowNotFound = true;
    return this;
  }

  customThrowIfNotFound(data = {}) {
    return this.runAfter((result: unknown) => {
      if (
        (!this._allowNotFound &&
          Array.isArray(result) &&
          result.length === 0) ||
        result === null ||
        result === undefined ||
        result === 0
      ) {
        throw this.modelClass().createNotFoundError(this.context(), data);
      } else {
        return result;
      }
    }) as MyQueryBuilder<M, R>;
  }

  clone(): this {
    const builder = super.clone();
    builder._allowNotFound = this._allowNotFound;
    return builder;
  }
}

export class BaseModel extends Model {
  QueryBuilderType!: MyQueryBuilder<this>;
  static get QueryBuilder() {
    return MyQueryBuilder;
  }

  static query<M extends Model>(
    this: Constructor<M>,
    trxOrKnex?: TransactionOrKnex
  ): MyQueryBuilder<M> {
    return (super.query(
      trxOrKnex
    ) as MyQueryBuilder<M>).customThrowIfNotFound();
  }
}
