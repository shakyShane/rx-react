import React from 'react';
import MiniCart from './MiniCart';
import store from './store/store';
import reducers from './reducers/main';
import asyncMiddlewares from './middlewares/async';

/**
 * Initial state from json file
 */
const initial = require('json!../data/initial.json');

/**
 * Create the store
 */
const mainStore = store(initial, reducers, asyncMiddlewares);

/**
 * Dispatch the update method to retrieve
 * users state on page load.
 */
mainStore.dispatch({type: 'ASYNC_UPDATE'});

/**
 * Now render a component
 */
React.render(<MiniCart store={mainStore} />, document.getElementById('mini-cart'));
