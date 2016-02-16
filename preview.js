require('browser-sync')
    .create('Preview')
    .init({
        server: 'app',
        middleware: [
            require('compression')()
        ]
    });
