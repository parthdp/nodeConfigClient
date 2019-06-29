import { SpringConfigStore } from "../config/store/spring/springConfigStore";

export interface IConfigController {
    getConfigStore(applicationName: string): SpringConfigStore
    refreshConfigStore(): void
}