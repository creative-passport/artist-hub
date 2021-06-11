import { Model, AjvValidator, Validator } from 'objection';
import isURL from 'validator/lib/isURL';

/**
 * The BaseModel is a database model which is extended by all other database
 * models
 */
export class BaseModel extends Model {
  static createValidator(): Validator {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        ajv.addFormat('url', (value) =>
          isURL(value, { require_protocol: true, protocols: ['http', 'https'] })
        );
      },
    });
  }
}
