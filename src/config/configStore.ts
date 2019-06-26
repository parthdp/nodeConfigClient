import { IConfigStore } from "./configStore.interface";
import {IConfig } from "./config.interface"

export class ConfigStore implements IConfigStore {
    public getConfig(name: string): IConfig {
        throw new Error("Method not implemented.");
    }
}