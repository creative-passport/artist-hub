import jsonSchema from './aptypes-schema.json';
import Ajv, { ValidateFunction } from 'ajv';
import * as APTypes from './aptypes';

export const ajv = new Ajv({ schemas: [jsonSchema] });

const schemaDefs = ['Activity', 'Note'];

for (const s of schemaDefs) {
  ajv.addSchema({
    $id: `https://schema.creativepassport.net/${s}.json`,
    $ref: `https://schema.creativepassport.net/defs.json#/definitions/${s}`,
  });
}

/**
 * Gets a validator for the JSON schema definition
 *
 * @param name - The name of an object in the schema definition
 * @returns A validation function
 */
export function getSchema(name: string): ValidateFunction {
  return ajv.getSchema(
    `https://schema.creativepassport.net/${name}.json`
  ) as ValidateFunction;
}

const validateActivity = getSchema('Activity');

/**
 * A type guard for an ActivityPub Activity
 *
 * @param json - Object to be validated
 * @returns If the object validates as an Activity
 */
export function isActivity(json: unknown): json is APTypes.Activity {
  return validateActivity(json);
}

/**
 * A type guard for an ActivityPub Note
 *
 * @param json - Object to be validated
 * @returns If the object validates as a Note
 */

const validateNote = getSchema('Note');
export function isNote(json: unknown): json is APTypes.Note {
  return validateNote(json);
}
