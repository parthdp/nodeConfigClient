import { IConfigController } from "./config-controller.interface";
import { IConfigStore } from "../config/configStore.interface";
import { SpringConfigControllerProperties } from "./spring-config-controller-properties.interface";
import { HttpService } from "../common/HttpService";

export class SpringConfigController implements IConfigController {
    
    private properties: SpringConfigControllerProperties;
    private httpService: HttpService;

    constructor(springConfigProperties: SpringConfigControllerProperties) {
        this.properties = springConfigProperties;
    }

    getConfigStore(): IConfigStore {
        Http
       
    }
    
    refreshConfigStore(): void {
        throw new Error("Method not implemented.");
    }
}