import { Loader } from './properties/loader';
import { ISpringConfigControllerProperties } from './properties/spring-config-controller-properties.interface';
import { SimpleLogger } from './common/logger/simpleLogger';
import { ILogger } from './common/logger/logger.interface';
import { IConfigController } from './controller/config-controller.interface';
import { SpringConfigController } from './controller/spring-config-controller';
import { IConfigStore } from './config/store/configStore.interface';
import { IConfig } from './config/config.interface';

const loader: Loader = new Loader();
const properties: ISpringConfigControllerProperties = loader.loadProperties();
const logger: ILogger = new SimpleLogger();

const springConfigController: IConfigController = new SpringConfigController(properties, logger);
springConfigController.loadConfig().then(() => {
    let configStore: IConfigStore = springConfigController.getConfigStore('sampleClient');
    const config: IConfig = configStore.getConfig('user.role', 'development');
    logger.logInfo(config.name + ":" + config.value);

    configStore = springConfigController.getConfigStore('sampleClient');
    const newConfig: IConfig = configStore.getConfig('user.role', 'staging');
    logger.logInfo(newConfig.name + ":" + newConfig.value);
});




