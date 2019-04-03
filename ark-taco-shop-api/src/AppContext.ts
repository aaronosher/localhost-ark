import { Logger } from "@arkecosystem/core-interfaces";

export interface CoreApiConfig {
    host: string;
    port: string;
}

export interface AppContextConfig {
    coreApi: CoreApiConfig;
}

export interface AppContext {
    logger: Logger.ILogger;
    config: AppContextConfig;
}

const logger: Logger.ILogger = {
    make: () => {
        return this;
    },
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
    verbose: console.log,
    suppressConsoleOutput: (suppress: boolean) => null,
};

export const AppContext: AppContext = {
    logger,
    config: {
        coreApi: {
            host: "0.0.0.0",
            port: "4003",
        },
    },
};
