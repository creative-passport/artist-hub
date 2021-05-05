const tsj = require('ts-json-schema-generator');
const fs = require('fs');

const config = {
  schemaId: 'https://schema.creativepassport.net/defs.json',
  path: './src/activitypub/aptypes.ts',
  tsconfig: './tsconfig.json',
  additionalProperties: true,
  type: '*',
};

const output_path = './src/activitypub/aptypes-schema.json';

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err) => {
  if (err) throw err;
});
