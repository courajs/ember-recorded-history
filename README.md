# ember-recorded-history

Ever wanted to have some logic depend on the user's navigation history
in your app?

After submitting a form, you could redirect the user to where they were
before.

Or a details route, where you cycle through many models, could offer a
close button which returns to the last _different_ route they were on.

## Installation

1. `ember install ember-recorded-history`
2. Include the router mixin:
```js
// app/router.js
import Ember from 'ember';
import config from './config/environment';
import { HistoryMixin } from 'ember-recorded-history';

const Router = Ember.Router.extend(HistoryMixin, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // ...
});

export default Router;
```

3. If you are using Ember 2.13, you'll need to use the `stable-history`
   location to work around a bug, which creates duplicate entries when
  the app refreshes:
```js
// app/router.js
import Ember from 'ember';
import { HistoryMixin } from 'ember-recorded-history';

const Router = Ember.Router.extend(HistoryMixin, {
  location: 'stable-history',
  // ...
});
```

4. If you're using < Ember 2.13, you'll need to use the `unique-history`
   location to backfill unique history state support.

## Docs

### `HistoryEntries`
A `HistoryEntry` represents a unique visit to a route. It has 4 properties:
- `path`: The path of the route, as shown in the URL bar (e.g. "/photos/4")
- `route`: The dot-separated route name, as you'd pass to `link-to` (e.g. "photos.show")
- `uuid`: A unique identifier which distinguishes multiple visits to the same route.
- `params`: An array of params for routes with dynamic segments

### The `recorded-history` service
The service provides 3 main properties:
- `currentEntry`: A `HistoryEntry` representing the current route. This
  can be leveraged to store state associated with this route.
- `pastEntries`: An array of `HistoryEntries`, oldest to most recent.
  These are where the user would end up if they used the back button.
- `futureEntries`: An array of `HistoryEntries`, from closest to
  furthest in the future. These are where the user would end up if they
  used the forward button.

The service also provides 2 useful methods:
- `returnTo(entry)`: Transition to an existing history entry, without
  modifying the history. As if the user pressed the back/forward buttons
  to return to that route.
- `transitionTo(entry)`: Transition to the specified state, as if the
  user navigated directly there. This discards future entries, and
  creates a new entry for the passed route.

### TODO: Components

It would be nice to have a version of `link-to` that can take a
`HistoryEntry`.

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
      this.get('history').transitionTo(this.get('previousRoute'));
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
