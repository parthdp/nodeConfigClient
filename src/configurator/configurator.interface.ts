import { SpringConfigStore } from "../config/store/spring/springConfigStore";

export interface IConfigurator {
    loadConfig(): Promise<void>
    getConfigStore(applicationName: string): SpringConfigStore
    refreshConfigStore(): Promise<void>
}