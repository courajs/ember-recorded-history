import Ember from 'ember';

import {
  transitionToEntry,
  replaceEntry
} from 'ember-recorded-history/utils/history-states';

const {
  Service,
  computed,
  inject,
  observer
} = Ember;

export default Service.extend({
  router: inject.service('-routing'),
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
      let state = JSON.parse(loadedState);
      this.set('state', state);
      Ember.assert("The current history entry doesn't match up with the loaded history. This is a bug in ember-recorded-history, please report it: https://github.com/courajs/ember-recorded-history/issues", (
          state.entries.length === 0 ||
          state.entries[state.position].uuid === history.state.uuid
      ));
    }
  },

  currentEntry: Ember.computed('state', function() {
    return this.get('entries')[this.get('position')];
  }),

  pastEntries: Ember.computed('state', function() {
    return this.get('entries').slice(0, this.get('position'));
  }),

  futureEntries: Ember.computed('state', function() {
    return this.get('entries').slice(this.get('position') + 1);
  }),

  transitionTo({route, params}) {
    this.get('router').transitionTo(route, params);
  },

  returnTo(entry) {
    let destination = this.get('entries').findIndex((state) => state.uuid === entry.uuid);
    if (destination === -1) {
      console.error("RecordedHistory#returnTo was passed an entry not from the history");
      return;
    }

    let offset = destination - this.get('position');
    window.history.go(offset);
  },

  _markReplaced() {
    this.set('replaced', true);
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
      if (info._names) {
        for (let name of info._names) {
          params.push(info.params[name]);
        }
      }
    });

    let state = this.get('state');
    let newEntry = {
      uuid,
      path,
      route,
      params
    };

    if (this.get('replaced')) {
      let newState = replaceEntry(state, newEntry);
      this.set('state', newState);
      this.set('replaced', false);
    } else {
      let newState = transitionToEntry(state, newEntry);
      this.set('state', newState);
    }
  }
});
