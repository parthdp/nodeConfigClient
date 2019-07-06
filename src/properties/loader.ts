import { ISpringConfigControllerProperties } from "../properties/spring-config-controller-properties.interface";
import fs from 'fs';

export class Loader {
    public loadProperties(): ISpringConfigControllerProperties {

        if (process.argv.length !== 3) {
            throw new Error('Bad Command.. Correct Use: node index.js <absoluteFilePathToConfigurationFile>');
        }

        const absolutePropertiesFilePath = process.argv[2];

        if (!fs.existsSync(absolutePropertiesFilePath)) {
            throw new Error(absolutePropertiesFilePath + ' does not exists');
        }

        return require(absolutePropertiesFilePath);
    }
}