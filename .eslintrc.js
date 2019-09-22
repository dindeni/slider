module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true,
    jasmine: true
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
  'no-unused-expressions': [2, {allowTernary: true}],
  'import/no-extraneous-dependencies': ['error', {'devDependencies': true, 'optionalDependencies': false, 'peerDependencies': false}]
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js']
      }
    }
  }

  };
