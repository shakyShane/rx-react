import Rx from 'rx-dom/dist/rx.dom';
const just = Rx.Observable.just;
const concat = Rx.Observable.concat;

export const BLANK = 'BLANK';
export const UPDATE = 'UPDATE';
export const LOADING = 'LOADING';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const SOMETHING_SLOW = 'SOMETHING_SLOW';

/**
 * Action creator for the update reducer
 * @param data
 * @returns {{type: string, data: *}}
 */
export function update (data = {}) {
    return {
        type: UPDATE,
        data
    }
}

export function somethingSlow () {
    return {
        type: SOMETHING_SLOW
    }
}

/**
 * Define how to handle incoming async actions
 */
export const actionHandlers = {
    [UPDATE]: () => {
        return Rx.Observable.concat(ajaxRequest('/data/load.json'));
    }
};

/**
 * @param {string} url
 * @returns {Rx.Observable[]}
 */
export function ajaxRequest(url, delay = 1000) {
    return [
        setLoading(true),
        Rx.DOM.getJSON(url)
            .delay(delay)
            .map(resp => update(resp)),
        setLoading(false)
    ];
}

/**
 * @param {string} url
 * @returns {Rx.Observable[]}
 */
export function ajaxPost(url, data, delay = 1000) {
    return [
        setLoading(true),
        Rx.DOM.post({
            url,
            responseType: 'json',
            body: data
        })
            .delay(delay)
            .map(resp => update(resp)),
        setLoading(false)
    ];
}

/**
 * Helper for dispatching clear messages action
 * @return {Rx.Observable}
 */
export function clearMessages (delay = 5000) {
    return just({type: CLEAR_MESSAGES})
        .delay(delay);
}


/**
 * Helper for dispatching loading action
 * @param {boolean} state
 * @return {Rx.Observable}
 */
export function setLoading(state) {
    return just({type: LOADING, data: state});
}
