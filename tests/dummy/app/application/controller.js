import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({
  numbers: [0,1,2,3,4,5,6,7,8,9],
  buckets: ['A-G', 'H-M', 'N-S', 'T-Z']
});
