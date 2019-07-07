export { Loader } from './properties/loader';
export { ISpringConfigControllerProperties } from './properties/spring-config-controller-properties.interface';
export { SimpleLogger } from './common/logger/simpleLogger';
export { ILogger } from './common/logger/logger.interface';
export { IConfigController } from './controller/config-controller.interface';
export { SpringConfigController } from './controller/spring-config-controller';
export { IConfigStore } from './config/store/configStore.interface';
export { IConfig } from './config/config.interface';


// const loader: Loader = new Loader();
// const properties: ISpringConfigControllerProperties = loader.loadProperties();
// const logger: ILogger = new SimpleLogger();

// const springConfigController: IConfigController = new SpringConfigController(properties, logger);
// springConfigController.loadConfig().then(() => {
//     let configStore: IConfigStore = springConfigController.getConfigStore('sampleClient');
//     const config: IConfig = configStore.getConfig('user.role', 'development');
//     logger.logInfo(config.name + ":" + config.value);

//     springConfigController.refreshConfigStore();

//     configStore = springConfigController.getConfigStore('sampleClient');
//     const newConfig: IConfig = configStore.getConfig('user.role', 'staging');
//     logger.logInfo(newConfig.name + ":" + newConfig.value);
// });




