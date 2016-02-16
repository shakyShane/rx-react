import React from 'react';

export default class MiniCart extends React.Component {

    constructor() {
        super();
        this.state = {}
    }

    componentWillMount() {
        this.setState(this.props.initial);
        this.props.data.subscribe((data) => {
            this.setState(data);
        });
    }


    render() {

        return (
            <div>
                Items in Cart: {this.state.summary_count}
            </div>
        );
    }
}
