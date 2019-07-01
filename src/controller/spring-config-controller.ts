import { HttpService } from "../common/httpService";
import { IConfigController } from "./config-controller.interface";
import { ILogger } from "../common/logger/logger.interface";
import { ISpringConfigControllerProperties } from "./spring-config-controller-properties.interface";
import { ISpringConfigResponse } from "../config/store/spring/config-response.interface";
import { IProfileConfigStore, SpringConfigStore } from "../config/store/spring/springConfigStore";
import { URL } from 'url';

export class SpringConfigController implements IConfigController {
    
    private httpService: HttpService;
    private configStoreMap: {[applicationName: string]: SpringConfigStore } = {}

    constructor(private properties: ISpringConfigControllerProperties, private logger: ILogger) {
        this.httpService = new HttpService();
    }

    public getConfigStore(applicationName: string): SpringConfigStore {

        if (this.configStoreMap[applicationName]) {
            return this.configStoreMap[applicationName];
        }

        this.properties.profiles.forEach(async profile => {
            await this.httpService.get(this.constructConfigUrl(applicationName, profile), {})
            .then((response: string) => {
                const configResponse: ISpringConfigResponse = JSON.parse(response);
                if(configResponse.propertySources.length > 0) {
                    // TODO: Support more than one property sources using priority
                    const source = configResponse.propertySources[0].source;
                    const profileConfigStore: IProfileConfigStore = {profileStore: {}};
                    Object.keys(source).forEach((key: string) => {
                        if (profileConfigStore.profileStore[profile]) {
                            profileConfigStore.profileStore[profile][name] = { name: key, value: source[key]}
                        } else {
                            profileConfigStore.profileStore[profile] = {}
                            profileConfigStore.profileStore[profile][name] = { name: key, value: source[key]}
                        }
                    })

                    this.configStoreMap[applicationName] = new SpringConfigStore(profileConfigStore);
                }
            }).catch((error: any) => {
                this.logger.logError(error);
            })   
        });
        
        return this.configStoreMap[applicationName];
    }
    
    public refreshConfigStore(): void {
        throw new Error("Method not implemented.");
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