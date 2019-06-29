import {IConfig } from "../../config.interface"
import { IConfigStore } from "../configStore.interface";

export interface IProfileConfigStore {
    profileStore: {[profileName: string ]: {[name: string]: IConfig}}
}

export class SpringConfigStore implements IConfigStore {

    private configs: IProfileConfigStore;

    constructor(configs: IProfileConfigStore) {
        this.configs = configs;
    }

    public getConfig(name: string, profile: string): IConfig {
        return this.configs.profileStore[profile][name];
    }
}