import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { timeout, dropTask } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";

import type Service from "@ember/service";
import type { TaskGenerator } from "ember-concurrency";

export default class DummyComponent extends Component {
  @service declare counter: Service;
  @tracked value = 1;

  @dropTask
  *delayedIncrement(delay: number): TaskGenerator<void> {
    const defaultDelay = 1000;
    yield timeout(delay || defaultDelay);
    this.counter.increment(this.value);
  }
}
