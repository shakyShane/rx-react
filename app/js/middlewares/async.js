import Rx from 'rx-dom/dist/rx.dom';
const just = Rx.Observable.just;

/**
 * Async middlewares
 */
export default {
    /**
     * Add an item to the cart
     */
    ASYNC_ADD: () => {
        return Rx.Observable.concat(
            update('/data/load-added.json')
                .concat(clearMessages())
        )
    },
    /**
     * Get the current users data
     */
    ASYNC_UPDATE: () => {
        return Rx.Observable.concat(update('/data/load.json'));
    }
};

/**
 * Helper for dispatching loading action
 * @param {boolean} state
 * @return {Rx.Observable}
 */
function setLoading(state) {
    return just({type: 'LOADING', data: state});
}

/**
 * Helper for dispatching clear messages action
 * @return {Rx.Observable}
 */
function clearMessages () {
    return just({type: 'CLEAR_MESSAGES'})
        .delay(5000);
}

/**
 * @param {string} url
 * @returns {Rx.Observable[]}
 */
function update(url) {
    return [
        setLoading(true),
        Rx.DOM.getJSON(url)
            .delay(1000)
            .map(resp => ({type: 'UPDATE', data: resp})),
        setLoading(false)
    ];
}
