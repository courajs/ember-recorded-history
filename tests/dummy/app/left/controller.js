import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({
  actions: {
    swap() {
      this.replaceRoute('right');
    }
  }
});
