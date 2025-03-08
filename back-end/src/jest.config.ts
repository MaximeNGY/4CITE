import type { Config } from 'jest';

const config: Config = {
  reporters: [['github-actions', { silent: false }], 'summary'],
  testTimeout: 30000,
  maxWorkers: 2,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
