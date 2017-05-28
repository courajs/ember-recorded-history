import Ember from 'ember';

import {
  stateForNewEntry
} from 'ember-recorded-history/utils/history-states';

const {
  Service,
  computed,
  observer
} = Ember;

export default Service.extend({
  entries: [],
  position: 0,

  state: computed('position', 'entries.[]', {
    get() {
      return this.getProperties('entries', 'position');
    },
    set(key, val) {
      let newVal = {
        entries: val.entries,
        position: val.position
      };
      this.setProperties(newVal);
      return newVal;
    }
  }),

  syncState: observer('state', function() {
    sessionStorage.setItem('ember-recorded-history', JSON.stringify(this.get('state')));
  }),

  init() {
    this._super(...arguments);
    let loadedState = sessionStorage.getItem('ember-recorded-history');
    if (loadedState) {
      this.set('state', JSON.parse(loadedState));
    }
  },

  currentEntry: Ember.computed('state', function() {
    return this.get('entries').objectAt(this.get('position'));
  }),

  pastEntries: Ember.computed('state', function() {
    return this.get('entries').slice(0, this.get('position'));
  }),

  futureEntries: Ember.computed('state', function() {
    return this.get('entries').slice(this.get('position') + 1);
  }),

  returnTo(entry) {
    let destination = this.get('entries').findIndex((state) => state.uuid === entry.uuid);
    if (destination === -1) {
      console.error("RecordedHistory#returnTo was passed an entry not from the history");
      return;
    }

    let offset = destination - this.get('position');
    window.history.go(offset);
  },

  _arrive(infos) {
    let leaf = infos[infos.length - 1];
    let route = leaf.name;

    let { path, uuid } = window.history.state;

    // This is private API. Someday when the Router Service is complete,
    // we should be able to use that instead.
    // Router Service RFC:
    // https://github.com/emberjs/rfcs/blob/master/text/0095-router-service.md
    let params = [];
    infos.forEach(function(info) {
      for (let name of info._names) {
        params.push(info.params[name]);
      }
    });

    let state = this.get('state');
    let newEntry = {
      uuid,
      path,
      route,
      params
    };

    let newState = stateForNewEntry(state, newEntry);
    this.set('state', newState);
  }
});
