import Rx from 'rx-dom/dist/rx.dom';

export default function store(initial, reducers, asyncMiddlewares) {

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
         * Apply any middlewares
         */
        .flatMap(applyMiddlewares)

        /**
         * Now pick out the reducer that matches the action type
         */
        .map(x => {

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
     * Create a `store` with similiar methods
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
     * Look at the incoming action, if its type matches an async middleware,
     * return the result from that, otherwise just pass along the value
     * (as it will be dealt with in reducers)
     * @param {{type: string}} incoming
     * @returns {*}
     */
    function applyMiddlewares (incoming) {
        if (typeof asyncMiddlewares[incoming.type] === 'function') {
            return asyncMiddlewares[incoming.type].call(null, incoming);
        } else {
            return Rx.Observable.just(incoming);
        }
    }

    return store;
};

