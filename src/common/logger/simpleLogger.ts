import { ILogger } from "./logger.interface";

export class SimpleLogger implements ILogger {
    public logInfo(message: string) {
       console.log(message);
    }
    
    public logError(message: string) {
        console.error(message);
    }
    
    public logWarning(message: string) {
        console.warn(message);
    }
}