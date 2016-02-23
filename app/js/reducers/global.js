import * as globalActions from '../actions/global';

export const LOADING = 'LOADING';

const _set = require('lodash.set');

/**
 * Reducers for synchronously updating the state object
 */
export default {
    [globalActions.LOADING]: function loadingReducer(state, data) {
        state.loading = data;
        return state;
    },
    [globalActions.UPDATE]: function updateReducer(state, data) {
        const newState = Object.assign({}, state, {data: data});
        return newState;
    },
    [globalActions.BLANK]: function blankReducer(state) {
        return state;
    },
    [globalActions.CLEAR_MESSAGES]: function clearMessagesReducer (state) {
        const copy = Object.assign({}, state);
        _set(copy, 'data.messages.messages', []);
        return copy;
    }
};
