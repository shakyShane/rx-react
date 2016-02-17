import Rx from 'rx-dom/dist/rx.dom';
const just = Rx.Observable.just;

function setLoading(state) {
    return just({type: 'LOADING', data: state});
}

function clearMessages () {
    return just({type: 'CLEAR_MESSAGES'});
}

function update(url) {
    return [
        setLoading(true),
        Rx.DOM.getJSON(url)
            .delay(1000)
            .map(resp => ({type: 'UPDATE', data: resp})),
        setLoading(false)
    ];
}

module.exports =  {
    ASYNC_ADD: () => {
        return Rx.Observable.concat(
            update('/data/load-added.json'),
            clearMessages()
        )
    },
    ASYNC_UPDATE: () => {
        return Rx.Observable.concat(update('/data/load.json'));
    }
};