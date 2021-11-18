module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const imports = root.find(j.ImportDeclaration);

  const findImport = (name) =>
    root.find(j.ImportDeclaration, {
      source: { type: 'Literal', value: name }
    });

  const emberConcurrencyImport = findImport('ember-concurrency');
  const emberConcurrencyDecoratorsImport = findImport('ember-concurrency-decorators');

  if (!emberConcurrencyDecoratorsImport.length) {
    return root.toSource();
  }

  const { specifiers } = emberConcurrencyDecoratorsImport.get(0).node;

  if (emberConcurrencyImport.length) {
    // Update existing ember-concurrency import declaration
    emberConcurrencyImport.replaceWith((nodePath) => {
      const { node } = nodePath;
      node.specifiers = [...node.specifiers, ...specifiers];
      return node;
    });
  } else {
    // Creat new ember-concurrency import declaration, insert at the end of the import list
    const newImportDeclariation = j.importDeclaration([...specifiers], j.literal('ember-concurrency'), 'value');
    imports.at(-1).insertAfter(newImportDeclariation);
  }

  emberConcurrencyDecoratorsImport.remove();

  return root.toSource({ quote: options.quote || 'single' });
};
