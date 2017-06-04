# ember-recorded-history

Ever wanted to have some logic depend on the user's navigation history
in your app?

After submitting a form, you could redirect the user to where they were
before.

Or a details route, where you cycle through many models, could offer a
close button which returns to the last _different_ route they were on.

Note: I've never tested this with `Ember.HashLocation`. If you try it, or
would like to help ensure a graceful fallback behavior, please let me
know! I'm available on the [Ember Community
Slack](https://emberjs.com/community/).

## Installation

1. `ember install ember-recorded-history`
2. Include the router mixin, and use the `tracking-history` location:
```js
// app/router.js
import Ember from 'ember';
import config from './config/environment';
import { HistoryMixin } from 'ember-recorded-history';

const Router = Ember.Router.extend(HistoryMixin, {
  location: 'tracking-history',
  rootURL: config.rootURL
});

Router.map(function() {
  // ...
});

export default Router;
```

## Docs

### `HistoryEntries`
A `HistoryEntry` represents a unique visit to a route. It has 4 properties:
- `path`: The path of the route, as shown in the URL bar (e.g. "/photos/4")
- `route`: The dot-separated route name, as you'd pass to `link-to` (e.g. "photos.show")
- `uuid`: A unique identifier which distinguishes multiple visits to the same route.
- `params`: An array of params for routes with dynamic segments

### The `recorded-history` service
The service provides 5 main properties:
- `currentEntry`: A `HistoryEntry` representing the current route. This
  can be leveraged to store state associated with this route.
- `pastEntries`: An array of `HistoryEntries`, oldest to most recent.
  These are where the user would end up if they used the back button.
- `futureEntries`: An array of `HistoryEntries`, from closest to
  furthest in the future. These are where the user would end up if they
  used the forward button.
- `entries`: All history entries. Equivalent to
  `pastEntries.concat(currentEntry, futureEntries)`.
- `position`: The index of the current history entry. `currentEntry` is
  equivalent to `entries[position]`.

The service also provides 2 useful methods:
- `returnTo(entry)`: Transition to an existing history entry, without
  modifying the history. As if the user pressed the back/forward buttons
  to return to that route.
- `transitionTo(entry)`: Transition to the specified state, as if the
  user navigated directly there. This discards future entries, and
  creates a new entry for the passed route.

## TODO
### Components
It would be nice to have a version of `link-to` that can take a
`HistoryEntry`.
### Check replace support
This probably doesn't work correctly with `replaceWith`
### Query param support
Check with `replace: true`

## Usage Example

Inject the `recorded-history` service into wherever you'd like to use
it:
```js
// photos/view/controller.js
import Ember from 'ember';

export default Ember.Controller.extend({
  history: Ember.inject.service('recorded-history'),

  previousRoute: Ember.computed('history.pastEntries.[]', function() {
    return this.get('history.pastEntries')
      .rejectBy('route', 'photos.view')
      .get('lastObject');
  }),

  actions: {
    returnToPrevious() {
      this.get('history').returnTo(this.get('previousRoute'));
    }
  }
});
```

```hbs
{{! photos/view/template.hbs }}
{{#if previousRoute}}
  <button {{action "returnToPrevious"}}>⬅︎ Return</button>
{{/if}}
<img src={{model.url}}>
```
