import React from 'react';
import MiniCart from './MiniCart';
import Rx from 'rx-dom/dist/rx.dom';
import _set from 'lodash.set';

/**
 * Initial state
 * @type {{cart: {summary_count: number}}}
 */
const initial = {
    data:{
        cart: {
            summary_count: 0
        },
        "messages": {
            "messages": [],
            "data_id": 0
        },
        "customer": {
            "data_id": 0
        }
    },
    loading: false
};

/**
 * Reducers for synchronously updating the state object
 */
const reducers = {
    LOADING: (state, data) => {
        state.loading = data;
        return state;
    },
    UPDATE: function (state, data) {
        const newState = Object.assign({}, state, {data: data}, {loading: false});
        return newState;
    },
    BLANK: function (state) {
        return state;
    },
    CLEAR_MESSAGES: function (state) {
        const copy = Object.assign({}, state);
        _set(copy, 'data.messages.messages', []);
        return copy;
    }
};

/**
 * Middlewares for async updates
 */
const asyncMiddlewares = {
    ASYNC_ADD: () => {
        return Rx.Observable.concat(
            Rx.Observable.just({type: 'LOADING', data: true}),
            Rx.DOM.getJSON('/data/load-added.json')
                .delay(1000)
                .map(resp => ({type: 'UPDATE', data: resp})),
            Rx.Observable.just({type: 'CLEAR_MESSAGES'})
                .delay(3000)
        )
    },
    ASYNC_UPDATE: () => {
        return Rx.Observable.concat(
            Rx.Observable.just({type: 'LOADING', data: true}),
            Rx.DOM.getJSON('/data/load.json')
                .map(resp => ({type: 'UPDATE', data: resp}))
        );
    }
};

/**
 * Store
 */
const state = new Rx.BehaviorSubject(initial);
const actions = new Rx.BehaviorSubject({type: 'BLANK'});

/**
 * Apply middlewares + reducers on state for every action
 * that occurs
 */
const storeUpdates$ = actions
    .flatMap(applyMiddlewares)
    .map(x => {
        const reducer = reducers[x.type];

        if (reducer === undefined) {
            console.error(`Reducer for the action type '${x.type}' was not found`);
            return {reducer: reducers['BLANK']};
        }

        return {
            reducer: reducers[x.type],
            data: x.data
        };
    })
    .scan((state, incoming) => incoming.reducer.apply(null, [state, incoming.data]), initial)
    .share();

// let the stream flow
storeUpdates$.subscribe(state);

const store = {
    dispatch: function (obj) {
        actions.onNext(obj);
    },
    getState: function () {
        return state.getValue();
    },
    subscribe: storeUpdates$.subscribe.bind(storeUpdates$)
};

// ask for initial data
actions.onNext({type: 'ASYNC_UPDATE'});


/**
 * Just a helper for picking out values
 * @param incoming
 * @returns {*}
 */
function applyMiddlewares (incoming) {
    if (asyncMiddlewares[incoming.type]) {
        return asyncMiddlewares[incoming.type](incoming);
    } else {
        return Rx.Observable.just(incoming);
    }
}


React.render(<MiniCart store={store} />, document.getElementById('mini-cart'));
