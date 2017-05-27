/*
 * This is to work around a bug in Ember.HistoryLocation.
 * It was always creating a fresh state with a new random uuid
 * every time it initializes. Instead, if this is a page refresh,
 * or re-opening a closed tab, we should just preserve the existing
 * state & uuid.
 *
 * I've opened a PR for this bug here:
 * https://github.com/emberjs/ember.js/pull/15223
 */



import Ember from 'ember';

const { 
  get,
  set,
  HistoryLocation
} = Ember;

export default HistoryLocation.extend({
  /**
    Used to set state on first call to setURL

    @private
    @method initState
  */
  initState() {
    let history = get(this, 'history') || window.history;
    set(this, 'history', history);

    if (history && 'state' in history) {
      this.supportsHistory = true;
    }

    let state = this.getState();
    let path = this.formatURL(this.getURL());
    if (state && state.path === path) { // preserve existing state
      // used for webkit workaround, since there will be no initial popstate event
      this._previousURL = this.getURL();
    } else {
      this.replaceState(path);
    }
  }
});
