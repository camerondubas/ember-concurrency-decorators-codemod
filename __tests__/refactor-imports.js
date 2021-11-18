jest.autoMockOff();

const defineTest = require("jscodeshift/dist/testUtils").defineTest;
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;
const transform = require("../refactor-imports");

defineTest(__dirname, 'refactor-imports');

describe("refactor-import", () => {
  defineInlineTest(
    transform,
    {},
    `import { dropTask } from 'ember-concurrency-decorators';`,
    `import { dropTask } from 'ember-concurrency';`,
    "No existing `ember-concurrency` import"
  );

  defineInlineTest(
    transform,
    {},
    `import { dropTask } from 'ember-concurrency-decorators';
      import { timeout } from 'ember-concurrency';`,
    `import { timeout, dropTask } from 'ember-concurrency';`,
    "Merging single import"
  );

  defineInlineTest(
    transform,
    {},
    `import { dropTask, task, enqueueTask } from 'ember-concurrency-decorators';
      import { timeout } from 'ember-concurrency';`,
    `import { timeout, dropTask, task, enqueueTask } from 'ember-concurrency';`,
    "Merging many imports"
  );

  defineInlineTest(
    transform,
    {},
    `import Component from '@glimmer/component';`,
    `import Component from '@glimmer/component';`,
    "Noop if no `ember-concurrency-decorators` or `ember-concurrency` import"
  );

  defineInlineTest(
    transform,
    {},
    `import { timeout } from 'ember-concurrency';`,
    `import { timeout } from 'ember-concurrency';`,
    "Noop if no `ember-concurrency-decorators` import"
  );

  defineInlineTest(
    transform,
    {},
    `import { dropTask, task, enqueueTask } from 'ember-concurrency-decorators';
     import Component from '@glimmer/component';`,
    `import Component from '@glimmer/component';
     import { dropTask, task, enqueueTask } from 'ember-concurrency';`,
    "Adds to bottom of import list"
  );
});

// describe('has ember-concurrency-decorators import',() => {
//   test('a', () => {
//     const input = ``;
//     const ouptut = ``;

//     defineInlineTest(transform, {}, input, output)
//   });
// })
