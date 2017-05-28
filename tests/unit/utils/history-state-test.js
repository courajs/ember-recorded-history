import { module, test } from 'qunit';
import {
  stateForNewEntry,
  restoreState
} from 'ember-recorded-history/utils/history-states';

module('Unit | Utility | history states');

let one = { uuid: 1 };
let two = { uuid: 2 };
let three = { uuid: 3 };
let four = { uuid: 4 };

test('#newState constructs a state for a new entry', function(assert) {
  let state = {
    entries: [],
    position: 0
  };
  let result = stateForNewEntry(state, one);
  assert.deepEqual(result, {
    entries: [one],
    position: 0
  });
});

test("#newState adds a new entry to the end of the history", function(assert) {
  let state = {
    entries: [one],
    position: 0
  };
  let result = stateForNewEntry(state, two);
  assert.deepEqual(result, {
    entries: [one, two],
    position: 1
  });
});

test("#newState backtracks position, but preserves future entries for an existing state", function(assert) {
  let state = {
    entries: [one, two],
    position: 1
  };
  let result = stateForNewEntry(state, one);
  assert.deepEqual(result, {
    entries: [one, two],
    position: 0
  });
});

test("#newState discards future entries when visiting a new state", function(assert) {
  let state = {
    entries: [one, two, three],
    position: 1
  };
  let result = stateForNewEntry(state, four);
  assert.deepEqual(result, {
    entries: [one, two, four],
    position: 2
  });
});

test("restoreState sets the correct position if we are within recorded state", function(assert) {
  let state = {
    entries: [one, two, three],
    position: 2
  };
  let result = restoreState(state, two);
  assert.deepEqual(result, {
    entries: [one, two, three],
    position: 1
  });
});

test("restoreState discards loaded state if it can't find the current entry", function(assert) {
  let state = {
    entries: [one, two],
    position: 1
  };
  let result = restoreState(state, three);
  assert.deepEqual(result, {
    entries: [three],
    position: 0
  });
});
