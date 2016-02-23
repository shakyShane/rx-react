import React from 'react';
import Messages from './Messages.jsx';
import * as cartActions from '../actions/cart';
import * as globalActions from '../actions/global';

export default class MiniCart extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.setState(this.props.store.getState());
        this.props.store.subscribe((data) => this.setState(data));
    }

    addToCart () {
        this.props.store.dispatch(cartActions.addToCart());
    }

    clearCart() {
        this.props.store.dispatch(cartActions.clearCart());
    }

    render() {
        const messages = this.state.data.messages.messages;
        return (
            <div className={this.state.loading ? 'loading' : ''}>
                { this.state.loading ? <p>Loading, please wait</p> : null }
                { this.state.loading ? null : <p>Click to Add an item to the cart</p> }
                Items in Cart: {this.state.data.cart.summary_count}
                <button onClick={this.addToCart.bind(this)} style={{marginLeft: '10px'}} disabled={this.state.loading}>Add More</button>
                <button onClick={this.clearCart.bind(this)} style={{marginLeft: '10px'}} disabled={this.state.loading}>Clear Cart</button>
                <Messages messages={messages} />
            </div>
        );
    }
}
