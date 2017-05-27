import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model({bucket}) {
    let first = bucket.charCodeAt(0);
    let last = bucket.charCodeAt(2);
    let letters = [];
    for (var c = first; c <= last; c++) {
      letters.push(String.fromCharCode(c));
    }

    return {
      bucket,
      letters
    }
  }
});
