import React from 'react';
import store from './store/store';
import reducers from './reducers/global';
import asyncReducers from './reducers/async';

import {update} from './actions/global';

import MiniCart from './components/MiniCart';
import AddToCartForm from './components/AddToCartForm.jsx';

/**
 * Initial state from json file
 */
const initialData = require('json!../data/initial.json');

/**
 * Create the store
 */
const mainStore = store(initialData, reducers, asyncReducers);

/**
 * Dispatch the update method to retrieve
 * users state on page load.
 */
mainStore.dispatch(update());

/**
 * Now render a component
 */
React.render(<MiniCart store={mainStore} />, document.getElementById('mini-cart'));
React.render(<AddToCartForm store={mainStore} />, document.getElementById('add-to-cart'));
