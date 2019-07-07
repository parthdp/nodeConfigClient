"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo("[Started] Loading configs for application: [" + this.properties.applicationName + "]");
            const promises = [];
            this.properties.profiles.forEach(profile => {
                promises.push(this.httpService.get(this.constructConfigUrl(this.properties.applicationName, profile), {}));
            });
            const profileConfigStore = { profileStore: {} };
            try {
                const responses = yield Promise.all(promises);
                let index = 0;
                responses.forEach((response) => {
                    const profile = this.properties.profiles[index++];
                    const configResponse = JSON.parse(response);
                    if (configResponse.propertySources.length > 0) {
                        // TODO: Support more than one property sources using priority
                        const source = configResponse.propertySources[0].source;
                        Object.keys(source).forEach((key) => {
                            this.logger.logInfo("Config for application: [" + this.properties.applicationName + "], profile: [" + profile + "], name: [" + key + "]");
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
                this.configStoreMap[this.properties.applicationName] = new springConfigStore_1.SpringConfigStore(profileConfigStore);
                this.logger.logInfo("[Completed] Loading configs for application: [" + this.properties.applicationName + "]");
                return Promise.resolve();
            }
            catch (error) {
                this.logger.logError("[Error] Loading configs for application: [" + this.properties.applicationName + "]");
                this.logger.logError(error);
                return Promise.reject(error);
            }
        });
    }
    getConfigStore(applicationName) {
        this.logger.logInfo("Getting configs for application: [" + applicationName + "]");
        return this.configStoreMap[applicationName];
    }
    refreshConfigStore() {
        this.logger.logInfo("[Started] Refreshing the configstore ...");
        this.loadConfig().then(() => {
            this.logger.logInfo("[Finished] Refreshing the configstore ...");
        }).catch((error) => {
            this.logger.logInfo("[Error] Refreshing the configstore ...");
            this.logger.logInfo("[Error] Refreshing the configstore ...");
        });
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
