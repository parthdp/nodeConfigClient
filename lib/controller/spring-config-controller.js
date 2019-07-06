"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpService_1 = require("../common/httpService");
const springConfigStore_1 = require("../config/store/spring/springConfigStore");
const url_1 = require("url");
class SpringConfigController {
    constructor(properties, logger) {
        this.properties = properties;
        this.logger = logger;
        this.configStoreMap = {};
        this.httpService = new httpService_1.HttpService();
    }
    getConfigStore(applicationName) {
        if (this.configStoreMap[applicationName]) {
            return Promise.resolve(this.configStoreMap[applicationName]);
        }
        const promises = [];
        return new Promise((resolve, reject) => {
            this.properties.profiles.forEach(profile => {
                promises.push(this.httpService.get(this.constructConfigUrl(applicationName, profile), {}));
            });
            const profileConfigStore = { profileStore: {} };
            Promise.all(promises).then((responses) => {
                let index = 0;
                responses.forEach((response) => {
                    const profile = this.properties.profiles[index++];
                    const configResponse = JSON.parse(response);
                    if (configResponse.propertySources.length > 0) {
                        // TODO: Support more than one property sources using priority
                        const source = configResponse.propertySources[0].source;
                        Object.keys(source).forEach((key) => {
                            this.logger.logInfo("loading " + key + " ..");
                            if (profileConfigStore.profileStore[profile]) {
                                profileConfigStore.profileStore[profile][key] = { name: key, value: source[key] };
                            }
                            else {
                                profileConfigStore.profileStore[profile] = {};
                                profileConfigStore.profileStore[profile][key] = { name: key, value: source[key] };
                            }
                        });
                    }
                });
                this.configStoreMap[applicationName] = new springConfigStore_1.SpringConfigStore(profileConfigStore);
                resolve(this.configStoreMap[applicationName]);
            }).catch((error) => {
                this.logger.logError(error);
                reject(error);
            });
        });
    }
    refreshConfigStore() {
        throw new Error("Method not implemented.");
    }
    constructConfigUrl(applicationName, profile) {
        if (!this.properties.authRequired) {
            return new url_1.URL(this.properties.httpProtocol + "://" +
                this.properties.hostname + ":" +
                this.properties.port + "/" +
                applicationName + "/" + profile +
                "/" + this.properties.label);
        }
        else {
            return new url_1.URL(this.properties.httpProtocol + "://" +
                this.properties.username + ":" + this.properties.password + "@" +
                this.properties.hostname + ":" +
                this.properties.port + "/" +
                applicationName + "/" + profile +
                "/" + this.properties.label);
        }
    }
}
exports.SpringConfigController = SpringConfigController;
