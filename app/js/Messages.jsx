import React from 'react';

export default class Messages extends React.Component {

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

    render() {
        const msgs = this.state.data.messages.messages;
        return (
            <ul>
               {msgs.map((x, i) => <li key={i} className={'message--' + x.type}>{x.text}</li>)}
            </ul>
        );
    }
}
