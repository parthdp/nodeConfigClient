export interface SpringConfigControllerProperties {
    hostname: string,
    port: number,
    httpProtocol: "http" | "https",
    authRequired: boolean,
    username: string,
    password: string,
    profiles: string[],
    label: string
}