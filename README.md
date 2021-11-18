# ember-concurrency-decorators-codemod

As of ember-concurrency 2.0.0, the decorators provided by `ember-concurrency-decorators`
have been moved directly into `ember-concurrency`, removing the need for this additional package.
This codemod refactors away existing `ember-concurrency-decorators` imports automatically.


## Prerequisites
- The target Ember app or addon must be using ember-concurrency >=2.0.0
in order for decorator imports to be available.

## Usage
```
git clone https://github.com/camerondubas/ember-concurrency-decorators-codemod
npx jscodeshift -t ember-concurrency-decorators-codemod/index.js path/of/files/ or/some**/*glob.js
```

##### Options
`--quotes`: Whether to use 'single' or "double" quotes for strings. Default value: `single`


## Examples

#### With `ember-concurrency` import

Before:
```js
import Component from '@glimmer/component';
import { timeout } from 'ember-concurrency';
import { dropTask, task } from 'ember-concurrency-decorators';
...
```

After:
```js
import Component from '@glimmer/component';
import { timeout, dropTask, task } from 'ember-concurrency';
...
```

#### Without`ember-concurrency` import

Before:
```js
import Component from '@glimmer/component';
import { dropTask, task } from 'ember-concurrency-decorators';
...
```

After:
```js
import Component from '@glimmer/component';
import { dropTask, task } from 'ember-concurrency';
...
```

