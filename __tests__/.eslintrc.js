'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ["plugin:jest/recommended"],
  env: {
    node: true
  },
};
