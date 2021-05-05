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

export function getSchema(name: string) {
  return ajv.getSchema(
    `https://schema.creativepassport.net/${name}.json`
  ) as ValidateFunction;
}

const validateActivity = getSchema('Activity');
export function isActivity(json: unknown): json is APTypes.Activity {
  return validateActivity(json);
}

const validateNote = getSchema('Note');
export function isNote(json: unknown): json is APTypes.Note {
  return validateNote(json);
}
