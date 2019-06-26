import { IConfigStore } from "../config/configStore.interface";

export interface IConfigController {
    getConfigStore(): IConfigStore
    refreshConfigStore(): void
}