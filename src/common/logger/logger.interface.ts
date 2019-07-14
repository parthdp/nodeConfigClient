export interface ILogger {
    logInfo(message: string): void
    logError(message: string): void
    logWarning(message: string): void
}