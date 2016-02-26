import Rx from 'rx-dom/dist/rx.dom';
import {ajaxRequest, ajaxPost, clearMessages} from './global';

export const ADD_TO_CART = 'ADD_TO_CART';
export const CLEAR_CART = 'CLEAR_CART';

/**
 * action creator for adding to cart
 * @returns {{type: string}}
 */
export function addToCart(data) {
    return {
        type: ADD_TO_CART,
        data: data
    }
}

/**
 * Action creator for clearing the cart
 * @returns {{type: string}}
 */
export function clearCart() {
    return {
        type: CLEAR_CART
    }
}

/**
 * Action handlers define how to handle the incoming action
 * They receive both the action & the current state (so that
 * you can do things such aborting depending on state)
 */
export const actionHandlers = {
    /**
     * Add an item to the cart
     */
    [ADD_TO_CART]: (action, state) => {
        console.log(action);
        return Rx.Observable.concat([
            ...ajaxPost('/data/load-added.json', action.data),
            clearMessages()
        ]);
    },
    /**
     * Add an item to the cart
     */
    [CLEAR_CART]: (action, state) => {
        if (state.loading) {
            return Rx.Observable.empty();
        }
        return Rx.Observable.concat([
            clearMessages(0),
            ...ajaxRequest('/data/clear.json')
        ])
    }
};
