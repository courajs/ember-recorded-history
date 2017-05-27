import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model({number}) {
    return number;
  }
});
