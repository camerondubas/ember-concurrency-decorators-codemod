import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { timeout, dropTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class DummyComponent extends Component {
  @service counter;
  @tracked value = 1;

  @dropTask
  *delayedIncrement() {
    yield timeout(1000);
    this.counter.increment(value);
  }
}
