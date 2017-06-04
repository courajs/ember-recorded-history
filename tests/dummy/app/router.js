import Ember from 'ember';
import config from './config/environment';
import { HistoryMixin } from 'ember-recorded-history';

const Router = Ember.Router.extend(HistoryMixin, {
  location: 'stable-history',
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('numbers', function() {
    this.route('show', { path: ':number' });
  });
  this.route('bucket', { path: ':bucket' }, function() {
    this.route('letter', { path: ':letter' });
  });
  this.route('left');
  this.route('right');
});

export default Router;
