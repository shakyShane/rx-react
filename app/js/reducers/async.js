import Rx from 'rx-dom/dist/rx.dom';

import * as cartActions   from '../actions/cart';
import * as globalActions from '../actions/global';

export default Object.assign(
    {},
    cartActions.actionHandlers,
    globalActions.actionHandlers
);
