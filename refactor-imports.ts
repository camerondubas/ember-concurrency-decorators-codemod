import type { API, FileInfo } from "jscodeshift";

interface Options {
  quote?: "single" | "double";
}

const parser = "ts";

export default function tranform(file: FileInfo, api: API, options: Options) {
  const { jscodeshift } = api;

  const codeshift = jscodeshift.withParser(parser);

  const root = codeshift(file.source);

  const findImport = (name) =>
    root.find(codeshift.ImportDeclaration, {
      source: { value: name },
      importKind: "value",
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
}
