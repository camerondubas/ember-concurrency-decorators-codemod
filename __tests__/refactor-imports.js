jest.autoMockOff();

const defineTest = require("jscodeshift/dist/testUtils").defineTest;
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;
const transform = require("../refactor-imports");

defineTest(__dirname, "refactor-imports");

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

    `import { dropTask, task, enqueueTask } from 'ember-concurrency';
import Component from '@glimmer/component';`,

    "Renames `ember-concurrency-decorators` import"
  );

  defineInlineTest(
    transform,
    {},
    `import Component from '@glimmer/component';
import { dropTask, task, enqueueTask } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';`,

    `import Component from '@glimmer/component';
import { dropTask, task, enqueueTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';`,

    "Retains import position when renaming `ember-concurrency-decorators` import"
  );

  defineInlineTest(
    transform,
    {},
    `import Component from '@glimmer/component';
import { dropTask, enqueueTask } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';`,

    `import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, dropTask, enqueueTask } from 'ember-concurrency';
import { action } from '@ember/object';`,

    "Retains import position when merging"
  );
});
