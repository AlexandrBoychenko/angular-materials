class Requests {

    static http({method = 'GET', url, data, headers = {}, json = true}) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

            let controller = json ?
                this._json(headers, data, xhr, resolve) :
                this._xWwwFormUrlencoded(headers, data, xhr, resolve);

            this._setHeaders(xhr, controller.headers);

            xhr.send(controller.data);

            xhr.onload = controller.onload;

            xhr.onerror = function () {
                reject(xhr);
            };

        });
    }

    static _json(headers, data, xhr, resolve) {

        headers['Content-Type'] = 'application/json';

        data = data ? JSON.stringify(data) : [];

        let onload = () => {
            try {
                xhr.json = JSON.parse(xhr.responseText);
            } catch (err) {
                new Error('Response data is not JSON');
            }

            resolve(xhr);
        };

        return {headers, data, onload};
    }

    static _xWwwFormUrlencoded(headers, data, xhr, resolve) {

        let encodeData = [];
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        if (data) {
            Object.keys(data).forEach((key) => {
                encodeData.push(`${key}=${encodeURIComponent(data[key])}`);
            });
        }

        let onload = () => {
            resolve(xhr);
        };

        return {headers, data: encodeData.join('&'), onload};
    }

    static get(options) {
        return this.http(options);
    }

    static post(options) {
        options['method'] = 'POST';
        return this.http(options);
    }

    static put(options) {
        options['method'] = 'PUT';
        return this.http(options);
    }

    static delete(options) {
        options['method'] = 'DELETE';
        return this.http(options);
    }

    static _setHeaders(xhr, headers) {
        Object.keys(headers).forEach((item) => {
            xhr.setRequestHeader(item, headers[item]);
        });
    }

}
