"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('request').defaults({ rejectUnauthorized: false });
const es6_promise_1 = require("es6-promise");
class HttpService {
    constructor() {
        this.startingHttpStatusErrorCode = 300;
    }
    get(url, headers) {
        return new es6_promise_1.Promise((resolve, reject) => {
            request.get({ url: url.toString(), headers }, (error, response, body) => {
                if (error) {
                    reject(error.code);
                }
                else if (response.statusCode < this.startingHttpStatusErrorCode) {
                    resolve(body);
                }
                else {
                    reject(response.body);
                }
            });
        });
    }
    post(url, headers) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const options = {
                headers,
                method: 'POST',
                url: url.toString(),
            };
            request(options, (error, response, body) => {
                if (error) {
                    reject(error.code);
                }
                else if (response.statusCode < this.startingHttpStatusErrorCode) {
                    resolve(body);
                }
                else {
                    reject(response.body);
                }
            });
        });
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=httpService.js.map