import { Model, AjvValidator, Validator } from 'objection';
import isURL from 'validator/lib/isURL';
import AjvErrors from 'ajv-errors';

/**
 * The BaseModel is a database model which is extended by all other database
 * models
 */
export class BaseModel extends Model {
  static createValidator(): Validator {
    return new AjvValidator({
      options: { allErrors: true, jsonPointers: true },
      onCreateAjv: (ajv) => {
        AjvErrors(ajv, { singleError: true });
        ajv.addFormat('url', (value) =>
          isURL(value, { require_protocol: true, protocols: ['http', 'https'] })
        );
      },
    });
  }
}
