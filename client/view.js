const api                    = require('../api/config');
const host                   = api.server.hostname;
const port                   = api.server.port;

class DataStorage {
    constructor() {
        this.getData();
    };

    getData() {
        Requests.get(
            {
                url: `${api.address}/templates`
            })
            .then(function (resp) {
                resp.status == '200' ? showTemplates(resp.json) : alert('Fail!');
            });
    }
}