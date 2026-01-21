import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class CounterComponent extends Component {
  @tracked count = 0;

  increment = () => {
    this.count++;
  }

  <template>
    <output>{{this.count}}</output>
    <button {{on "click" this.increment}} type="button">+</button>
  </template>
}
