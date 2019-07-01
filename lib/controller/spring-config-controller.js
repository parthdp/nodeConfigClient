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
    getConfigStore(applicationName) {
        if (this.configStoreMap[applicationName]) {
            return this.configStoreMap[applicationName];
        }
        this.properties.profiles.forEach((profile) => __awaiter(this, void 0, void 0, function* () {
            yield this.httpService.get(this.constructConfigUrl(applicationName, profile), {})
                .then((response) => {
                const configResponse = JSON.parse(response);
                if (configResponse.propertySources.length > 0) {
                    // TODO: Support more than one property sources using priority
                    const source = configResponse.propertySources[0].source;
                    const profileConfigStore = { profileStore: {} };
                    Object.keys(source).forEach((key) => {
                        if (profileConfigStore.profileStore[profile]) {
                            profileConfigStore.profileStore[profile][name] = { name: key, value: source[key] };
                        }
                        else {
                            profileConfigStore.profileStore[profile] = {};
                            profileConfigStore.profileStore[profile][name] = { name: key, value: source[key] };
                        }
                    });
                    this.configStoreMap[applicationName] = new springConfigStore_1.SpringConfigStore(profileConfigStore);
                }
            }).catch((error) => {
                this.logger.logError(error);
            });
        }));
        return this.configStoreMap[applicationName];
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
