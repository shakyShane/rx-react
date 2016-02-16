import React from 'react';
import MiniCart from './MiniCart.jsx';
import Rx from 'rx-dom/dist/rx.dom';

/**
 * Initial state
 * @type {{cart: {summary_count: number}}}
 */
const initial = {cart: {summary_count: 0}};
/**
 * Use a subject to represent state, starting
 * with initial state
 */
const data    = new Rx.BehaviorSubject(initial);
/**
 * Create a shareble stream of data
 */
const data$   = data.share();
/**
 * Create a stream that only contain cart updates
 */
const cart$   = data$.map(x => x.cart);

/**
 * Now on page load, get the customers state via Ajax
 */
const stream$ = Rx.DOM.getJSON('/data/load.json').subscribe(resp => data.onNext(resp));

/**
 * SIMULATION
 * Here, we simulate something such as an item being added to cart,
 * we push new state into the stream and then any listeners will be updated
 */
setTimeout(function () {
    data.onNext({
        cart: {
            summary_count: 2
        }
    });
}, 5000);

React.render(<MiniCart data={cart$} initial={initial} />, document.getElementById('mini-cart'));
