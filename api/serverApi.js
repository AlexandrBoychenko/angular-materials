const server                    = require('dominion');
const config                    = use('config');

server.addComponent(use('components/notifications'));
server.addComponent(use('components/cors'));

server.addComponent(require('./components/tasks'));

const Message = use('core/messages');

Message.request.addInterceptor(function requestInterceptorLogConsole(){
    console.log('-> Request interceptor to: ' + this.request.path);
});

Message.response.addInterceptor(function responseInterceptorLogConsole(body){
    console.log('<- Response interceptor from: ' + this.request.path);
    return body;
});

Message.response.addInterceptor(function responseInterceptorAddServerNameHeader(body){
    this.response.headers['Server'] = 'Dominion';
    return body;
});

process.on('uncaughtException', (err) => {
    console.dir(`Uncaught exception: ${err}`);
});

server.start(config);