import React from 'react';
import Messages from './Messages.jsx';
import * as cartActions from '../actions/cart';
import * as globalActions from '../actions/global';
import formSerialize from 'form-serialize';

export default class AddToCartForm extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.setState(this.props.store.getState());
        this.props.store.subscribe((data) => this.setState(data));
    }

    addToCart () {
        const serialized = formSerialize(this.refs.form.getDOMNode(), { hash: true });
        this.props.store.dispatch(cartActions.addToCart(serialized));
    }

    render() {
        return (
            <form ref="form">
                <input type="hidden" name="product" value="1417" />
                <input type="hidden" name="selected_configurable_option" value="" />
                <input type="hidden" name="related_product" id="related-products-field" value="" />
                <input name="form_key" type="hidden" value="E59C6UVnr4hE3Tos" />
                <button type="button" onClick={this.addToCart.bind(this)}>Add</button>
            </form>
        );
    }
}
