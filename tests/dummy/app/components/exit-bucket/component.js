import Ember from 'ember';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  history: inject.service('recorded-history'),

  withinBucket: computed('history.currentEntry', function() {
    return this.get('history.currentEntry.route').indexOf('bucket') === 0;
  }),

  canExit: computed('withinBucket', 'previousRoute', function() {
    return this.get('withinBucket') && this.get('previousRoute');
  }),

  previousRoute: computed('history.pastEntries.[]', function() {
    let otherRoutes = this.get('history.pastEntries').filter(function(entry) {
      return entry.route.indexOf('bucket') !== 0;
    });
    return otherRoutes[otherRoutes.length - 1];
  }),

  actions: {
    transitionOut() {
      this.get('history').transitionTo(this.get('previousRoute'));
    }
  }
});
