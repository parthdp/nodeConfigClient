export interface ISpringConfigResponse {
    name: string
    profiles: string[]
    label: string
    version: string
    state: string
    propertySources: ISpringConfigSource[]
}

export interface ISpringConfigSource {
    name: string,
    source: any
}