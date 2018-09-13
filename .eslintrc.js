module.exports = {
  extends: ['eslint:recommended'],
  env: {
    es6: true,
  },
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: '6',
    sourceType: 'module',
  },
  rules: {
    'no-shadow': 'warn',
    'no-unused-vars': 'error',
    'object-curly-spacing': 0,
  },
  globals: {
    process: true,
    setTimeout: true,
    clearTimeout: true,
    setInterval: true,
    clearInterval: true,
    Promise: true,
    describe: true,
    it: true,
    beforeEach: true,
    afterEach: true,
  },
};
