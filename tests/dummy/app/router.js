import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('numbers', function() {
    this.route('show', { path: ':number' });
  });
  this.route('bucket', { path: ':bucket' }, function() {
    this.route('letter', { path: ':letter' });
  });
});

export default Router;
