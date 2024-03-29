import { HttpService } from "../common/httpService";
import { IConfigurator } from "./configurator.interface";
import { ILogger } from "../common/logger/logger.interface";
import { ISpringConfigControllerProperties } from "../properties/spring-config-controller-properties.interface";
import { ISpringConfigResponse } from "../config/store/spring/config-response.interface";
import { IProfileConfigStore, SpringConfigStore } from "../config/store/spring/springConfigStore";
import { URL } from 'url';

export class SpringConfigurator implements IConfigurator{
    
    private httpService: HttpService;
    private configStoreMap: {[applicationName: string]: SpringConfigStore } = {}

    constructor(private properties: ISpringConfigControllerProperties, private logger: ILogger) {
        this.httpService = new HttpService();
    }

    public async loadConfig(): Promise<void> {
        this.logger.logInfo("[Started] Loading configs for application: [" + this.properties.applicationName + "]");

        const promises: any = []
        this.properties.profiles.forEach(profile => {
            promises.push(this.httpService.get(this.constructConfigUrl(this.properties.applicationName, profile), {}));   
        });

        const profileConfigStore: IProfileConfigStore = {profileStore: {}};

        try {
            const responses: any = await Promise.all(promises);

            let index = 0;
            responses.forEach((response: string) => {
                const profile: string = this.properties.profiles[index++];
                const configResponse: ISpringConfigResponse = JSON.parse(response);
                if(configResponse.propertySources.length > 0) {
                    // TODO: Support more than one property sources using priority
                    const source = configResponse.propertySources[0].source;

                    Object.keys(source).forEach((key: string) => {
                        this.logger.logInfo("Config for application: [" + this.properties.applicationName + "], profile: [" + profile + "], name: [" + key + "]");

                        if (profileConfigStore.profileStore[profile]) {
                            profileConfigStore.profileStore[profile][key] = { name: key, value: source[key]}
                        } else {
                            profileConfigStore.profileStore[profile] = {}
                            profileConfigStore.profileStore[profile][key] = { name: key, value: source[key]}
                        }
                    });
                }
            });
        
            this.configStoreMap[this.properties.applicationName] = new SpringConfigStore(profileConfigStore);
        
            this.logger.logInfo("[Completed] Loading configs for application: [" + this.properties.applicationName + "]");
            return Promise.resolve();
        } catch (error) {
            this.logger.logError("[Error] Loading configs for application: [" + this.properties.applicationName + "]");
            this.logger.logError(error);
            return Promise.reject(error);
        }
    }

    public getConfigStore(applicationName: string): SpringConfigStore {
        this.logger.logInfo("Getting configs for application: [" + applicationName + "]");
        return this.configStoreMap[applicationName];
    }
    
    public refreshConfigStore(): Promise<void> {
        this.logger.logInfo("[Started] Refreshing the configstore ...");
        return new Promise((resolve, reject) => {
            this.loadConfig().then(() => {
                this.logger.logInfo("[Finished] Refreshing the configstore ...");
                resolve();
            }).catch((error) => {
                this.logger.logInfo("[Error] Refreshing the configstore ...");
                this.logger.logInfo(error);
                reject(error);
            })
        });
    }

    private constructConfigUrl(applicationName: string, profile: string): URL {
        if (!this.properties.authRequired) {
            return new URL(
                this.properties.httpProtocol + "://" +
                this.properties.hostname + ":" +
                this.properties.port + "/" +
                applicationName + "/" + profile +
                "/" + this.properties.label);
        } else {
            return new URL(
                this.properties.httpProtocol + "://" +
                this.properties.username + ":" + this.properties.password + "@" +
                this.properties.hostname + ":" +
                this.properties.port + "/" +
                applicationName + "/" + profile +
                "/" + this.properties.label); 
        }
    }
}