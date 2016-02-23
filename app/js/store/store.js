import Rx from 'rx-dom/dist/rx.dom';

export default function store(initial, reducers, asyncReducers) {

    /**
     * `state` is the single, shared application state
     * that can be updated via reducers only
     */
    const state$ = new Rx.BehaviorSubject(initial);

    /**
     * We use a separate stream to represent the actions
     */
    const actions$ = new Rx.BehaviorSubject({type: 'BLANK'});

    /**
     * Now take each action and first select a middleware
     * (if it exists) or a reducer that matches the 'type' key
     */
    const storeUpdates$ = actions$
        /**
         * Merge the incoming action with the current state
         */
        .withLatestFrom(state$, (action, state) => ({action, state}))
        /**
         * Process middlewares (note, middlewares themselves can return
         * actions
         */
        .flatMap(x => applyAsyncReducers(x.action, x.state))
        /**
         * Now pick out the reducer that matches the action type
         */
        .map(x => {

            /**
             * Now try to select the reducer
             */
            const reducer = reducers[x.type];

            /**
             * Log to the console if an action was called that does not
             * exist.
             */
            if (reducer === undefined) {
                console.error(`Reducer for the action type '${x.type}' was not found`);
                return {
                    reducer: reducers['BLANK']
                };
            }

            return {
                reducer: reducers[x.type],
                data: x.data
            };
        })
        /**
         * Finally apply the reducer function to the current state
         */
        .scan((state, incoming) => incoming.reducer.apply(null, [state, incoming.data]), initial)
        .share();

    /**
     * Let the stream flow
     */
    storeUpdates$.subscribe(state$);

    /**
     * Create a `store` with similar methods
     */
    const store = {
        dispatch: function (obj) {
            actions$.onNext(obj);
        },
        getState: function () {
            return state$.getValue();
        },
        subscribe: storeUpdates$.subscribe.bind(storeUpdates$)
    };

    /**
     * Look at the incoming action, if its type matches an async reducer,
     * return the result from that, otherwise just pass along the value
     * (as it will be dealt with in reducers)
     * @param {{type: string}} incoming
     * @returns {*}
     */
    function applyAsyncReducers (incoming) {
        if (typeof asyncReducers[incoming.type] === 'function') {
            return asyncReducers[incoming.type].apply(null, arguments);
        } else {
            return Rx.Observable.just(incoming);
        }
    }

    return store;
};

