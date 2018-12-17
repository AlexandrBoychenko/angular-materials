module.exports = {
    server: {
        host: '0.0.0.0',
        port: 3000
    },

    database: "mysql://root:root@localhost/todo",

    router: {
        // e.g. api/v2/
        urlPrefix: '',
        // e.g. '[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}'
        primaryKeyPattern: '\\d+'
    },

    cors: {
        // e.g. * | ['example.com'] | () => {} (synchronous callback function with Message context returning array of allowed origins)
        origin: '*',
        methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
        headers: ['Content-Type', 'Set-Cookies', 'Access-Token'],
        credentials: false,
        maxAge: 5 /* seconds */
    }
};