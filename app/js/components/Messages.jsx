import React from 'react';

export default class Messages extends React.Component {

    constructor() {
        super();
    }

    render() {
        const msgs = this.props.messages;
        return (
            <ul>
               {msgs.map((x, i) => <li key={i} className={'message--' + x.type}>{x.text}</li>)}
            </ul>
        );
    }
}
