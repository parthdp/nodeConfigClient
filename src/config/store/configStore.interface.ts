import { IConfig } from "../config.interface";

export interface IConfigStore {
    getConfig(name: string, profile: string): IConfig
}