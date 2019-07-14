import { ISpringConfigControllerProperties } from "../properties/spring-config-controller-properties.interface";
import fs from 'fs';

export class Loader {
    public loadProperties(propertiesFilePath: string): ISpringConfigControllerProperties {

        if (!fs.existsSync(propertiesFilePath)) {
            throw new Error(propertiesFilePath + ' does not exists');
        }

        return require(propertiesFilePath);
    }
}