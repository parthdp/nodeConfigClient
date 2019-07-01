"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const request_1 = __importDefault(require("request"));
class HttpService {
    constructor() {
        this.startingHttpStatusErrorCode = 300;
    }
    get(url, headers) {
        return new es6_promise_1.Promise((resolve, reject) => {
            request_1.default.get({ url: url.toString(), headers }, (error, response, body) => {
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
            request_1.default(options, (error, response, body) => {
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
