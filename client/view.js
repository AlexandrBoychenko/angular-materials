const host                   = 'http://127.0.0.1';
const port                   = 3000;

class DataStorage {
    constructor() {
        this.getData('tasks');
        this.wrapperDiv = document.querySelector('.wrapper');
    };

    async getData(items) {
        let resp = await Requests.get(
            {
                url: `${host}:${port}/${items}`
            });
        resp.status === '200' ? new Error('Request is not correct!') : this.showItems(resp.json);
    }

    showItems(itemsJSON) {
        itemsJSON.forEach((item) => {
            let {date, description} = item;
            let itemDiv = document.createElement('div');
            itemDiv.innerText = `${description}, ${new Date(date).toDateString()}`;
            this.wrapperDiv.appendChild(itemDiv);
        })
    }
}

new DataStorage();