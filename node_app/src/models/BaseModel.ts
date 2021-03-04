import {
  Model,
  QueryBuilderType,
  Constructor,
  TransactionOrKnex,
} from 'objection';

export class BaseModel extends Model {
  static query<M extends Model>(
    this: Constructor<M>,
    trxOrKnex?: TransactionOrKnex
  ): QueryBuilderType<M> {
    return super.query(trxOrKnex).throwIfNotFound() as QueryBuilderType<M>;
  }
}
