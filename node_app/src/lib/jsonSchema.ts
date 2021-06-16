import { JSONSchema as OJSONSchema } from 'objection';

export interface JSONSchema extends OJSONSchema {
  errorMessage?:
    | string
    | {
        properties: {
          [prop: string]: string;
        };
      };
}
