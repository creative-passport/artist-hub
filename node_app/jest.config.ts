import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  roots: ['tests/'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/jspm_packages'],
};

export default config;
