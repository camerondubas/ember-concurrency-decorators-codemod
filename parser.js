const babylon = require('@babel/parser');

const options = {
  sourceType: 'module',
  allowHashBang: true,
  ecmaVersion: Infinity,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'estree',
    'jsx',
    'asyncGenerators',
    'classProperties',
    'doExpressions',
    'exportExtensions',
    'functionBind',
    'functionSent',
    'objectRestSpread',
    'dynamicImport',
    'nullishCoalescingOperator',
    'optionalChaining',
    ['decorators', {decoratorsBeforeExport: true}],
  ],
};

module.exports = {
  parse(code) {
    return babylon.parse(code, options);
  }
};
