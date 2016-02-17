const _set = require('lodash.set');

/**
 * Reducers for synchronously updating the state object
 */
module.exports = {
    LOADING: (state, data) => {
        state.loading = data;
        return state;
    },
    UPDATE: function (state, data) {
        const newState = Object.assign({}, state, {data: data});
        return newState;
    },
    BLANK: function (state) {
        return state;
    },
    CLEAR_MESSAGES: function (state) {
        console.log('clear');
        const copy = Object.assign({}, state);
        _set(copy, 'data.messages.messages', []);
        return copy;
    }
};
