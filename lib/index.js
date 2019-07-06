"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./properties/loader");
const simpleLogger_1 = require("./common/logger/simpleLogger");
const spring_config_controller_1 = require("./controller/spring-config-controller");
const loader = new loader_1.Loader();
const properties = loader.loadProperties();
const logger = new simpleLogger_1.SimpleLogger();
const springConfigController = new spring_config_controller_1.SpringConfigController(properties, logger);
springConfigController.loadConfig().then(() => {
    let configStore = springConfigController.getConfigStore('sampleClient');
    const config = configStore.getConfig('user.role', 'development');
    logger.logInfo(config.name + ":" + config.value);
    configStore = springConfigController.getConfigStore('sampleClient');
    const newConfig = configStore.getConfig('user.role', 'staging');
    logger.logInfo(newConfig.name + ":" + newConfig.value);
});
