module.exports = {
  setupFiles: ['./jest-setup.js'],
  preset: 'ts-jest',
  roots: [
    './src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      babel: true,
      tsConfig: 'tsconfig.json',
    },
  },
};
