module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
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
  'import/no-extraneous-dependencies': ['error', {'devDependencies': true, 'optionalDependencies': false, 'peerDependencies': false}],
  '@typescript-eslint/no-explicit-any': 'error',
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      'js': 'never',
      'ts': 'never',
    }
  ]
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.ts']
      }
    }
  }
};
