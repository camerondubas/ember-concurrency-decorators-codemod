import { defineTest, defineInlineTest } from "jscodeshift/src/testUtils";
import transform from "../refactor-imports";

defineTest(__dirname, "refactor-imports");
defineTest(__dirname, "refactor-imports", null, "refactor-imports-typescript", {
  parser: "ts",
});

describe("refactor-imports", () => {
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
  defineInlineTest(
    transform,
    {},
    `
    import type { TaskGenerator } from 'ember-concurrency';
    import { dropTask } from 'ember-concurrency-decorators';
    `,
    `
    import type { TaskGenerator } from 'ember-concurrency';
    import { dropTask } from 'ember-concurrency';
    `,

    "Ignore type imports basic"
  );

  defineInlineTest(
    transform,
    {},
    `
    import { task } from 'ember-concurrency';
    import type { TaskGenerator } from 'ember-concurrency';
    import { dropTask } from 'ember-concurrency-decorators';
    `,
    `
    import { task, dropTask } from 'ember-concurrency';
    import type { TaskGenerator } from 'ember-concurrency';
    `,

    "Ignore type imports with existing import"
  );

  defineInlineTest(
    transform,
    {},
    `
    import type { TaskGenerator } from 'ember-concurrency';
    import { task } from 'ember-concurrency';
    import { dropTask, enqueueTask } from 'ember-concurrency-decorators';
    `,
    `
    import type { TaskGenerator } from 'ember-concurrency';
    import { task, dropTask, enqueueTask } from 'ember-concurrency';
    `,

    "Ignore type imports: complex case"
  );
});
