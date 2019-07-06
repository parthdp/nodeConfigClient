"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./properties/loader");
const simpleLogger_1 = require("./common/logger/simpleLogger");
const spring_config_controller_1 = require("./controller/spring-config-controller");
const loader = new loader_1.Loader();
const properties = loader.loadProperties();
const logger = new simpleLogger_1.SimpleLogger();
const springConfigController = new spring_config_controller_1.SpringConfigController(properties, logger);
springConfigController.getConfigStore('sampleClient').then((configStore) => {
    logger.logInfo(JSON.stringify(configStore));
});
