const http                              = require('http');
const static                            = require('node-static');
const path                              = require('path');
const port                              = 80;


const file = new static.Server('./', {
    cache: 0
});

http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(port);

console.log(`server listening on ${port}, Ctrl+C to stop`);