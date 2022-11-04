const parser = require("./parser.js");

module.exports = (file, api, options) => {
  const { jscodeshift } = api;
  const root = jscodeshift(file.source);

  const findImport = (name) =>
    root.find(jscodeshift.ImportDeclaration, {
      source: { type: "Literal", value: name },
    });

  const emberConcurrencyImport = findImport("ember-concurrency");
  const emberConcurrencyDecoratorsImport = findImport(
    "ember-concurrency-decorators"
  );

  if (!emberConcurrencyDecoratorsImport.length) {
    return root.toSource();
  }

  const { specifiers: emberConcurrencyDecoratorsSpecifiers } =
    emberConcurrencyDecoratorsImport.get(0).node;

  if (emberConcurrencyImport.length) {
    // Update existing ember-concurrency import declaration
    emberConcurrencyImport
      .get(0)
      .node.specifiers.push(...emberConcurrencyDecoratorsSpecifiers);

    emberConcurrencyDecoratorsImport.remove();
  } else {
    // Rename ember-concurrency-decorators import declaration
    emberConcurrencyDecoratorsImport.get(0).node.source.value =
      "ember-concurrency";
  }

  return root.toSource({ quote: options.quote || "single" });
};

module.exports.parser = parser;
