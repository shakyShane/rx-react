import React from 'react';
import Messages from './Messages.jsx';

export default class MiniCart extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.setState(this.props.store.getState());
        this.subscription$ = this.props.store.subscribe((data) => this.setState(data));
        this.props.store.subscribe((data) => this.setState(data));
    }
    componentWillUnmount() {
        this.subscription$.dispose();
    }

    addToCart () {
        this.props.store.dispatch({type: 'ASYNC_ADD'});
    }

    render() {

        return (
            <div className={this.state.loading ? 'loading' : ''}>
                { this.state.loading ? <p>Loading, please wait</p> : null }
                { this.state.loading ? null : <p>Click to Add an item to the cart</p> }
                Items in Cart: {this.state.data.cart.summary_count}
                <button onClick={this.addToCart.bind(this)} style={{marginLeft: '10px'}} disabled={this.state.loading}>Add More</button>
                <Messages store={this.props.store} />
            </div>
        );
    }
}
