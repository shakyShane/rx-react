import Rx from 'rx-dom/dist/rx.dom';

export default function store(initial, reducers, asyncMiddlewares) {

    /**
     * `state` is the single, shared application state
     * that can be updated via reducers only
     */
    const state$ = new Rx.BehaviorSubject(initial);

    /**
     * We use a separate stream to repesent the actions
     */
    const actions$ = new Rx.BehaviorSubject({type: 'BLANK'});

    /**
     * Now
     */
    const storeUpdates$ = actions$
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
    storeUpdates$.subscribe(state$);

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

    return store;
};

