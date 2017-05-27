import Ember from 'ember';

const {
  Component,
  inject
} = Ember;

export default Component.extend({
  history: inject.service('recorded-history'),
  actions: {
    returnTo(entry) {
      this.get('history').returnTo(entry);
    }
  }
});
