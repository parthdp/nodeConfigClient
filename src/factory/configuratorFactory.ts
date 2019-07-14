import { IConfigurator } from "../configurator/configurator.interface";
import { SpringConfigurator } from "../configurator/spring-configurator";
import { ISpringConfigControllerProperties } from "../properties/spring-config-controller-properties.interface";
import { ILogger } from "../common/logger/logger.interface";

class ConfiguratorFactory {
    private configurator!: IConfigurator;

    public getDefaultConfigurator(properties: ISpringConfigControllerProperties, logger: ILogger): Promise<IConfigurator> {
        if (this.configurator) {
            return Promise.resolve(this.configurator);
        }

        this.configurator = new SpringConfigurator(properties, logger);
        return new Promise<IConfigurator>((resolve, reject) => {
            this.configurator.loadConfig().then(() => {
                logger.logInfo("Spring configuration properties loaded successfully");
                resolve(this.configurator);
            }).catch((error: any) => {
                reject("Loading configurations failed: " + error);
            })
        })
    };
}

export let configuratorFactory = new ConfiguratorFactory();