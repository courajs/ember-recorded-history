import Ember from 'ember';

export default Ember.Mixin.create({
  recordedHistory: Ember.inject.service('recorded-history'),

  didTransition(infos) {
    this._super(...arguments);
    if (this.get('location.implementation') === 'history' ||
        this.get('location.concreteImplementation.implementation') === 'history') {
      Ember.run.once(this, "handleRouteArrival", infos);
    }
  },

  handleRouteArrival: function(infos) {
    this.get('recordedHistory').arrive(infos);
  }
});
