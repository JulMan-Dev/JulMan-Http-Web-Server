export type HttpOptions = {
    port: number;
}

export type PluginsOptions = {
    loadPlugins: boolean;
    backlistPluginsNames: string[];
}

export type ServerScriptsOptions = {
    allowFilesystem: boolean;
    allowOtherScriptsExecution: boolean;
}

export type ServerConfig = {
    httpOptions: HttpOptions;
    pluginsOptions: PluginsOptions;
    requireAbsulutePath: boolean;
    executeServerScripts: boolean;
    executeServerScriptsFileWidget: boolean;
    serverScriptsOptions: ServerScriptsOptions;
    errorPages: {
        [error_code: string]: string | 0;
    }
}