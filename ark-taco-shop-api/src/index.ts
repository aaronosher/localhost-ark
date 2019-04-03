"use strict";

import { AppContext } from "./AppContext";
import { database, DatabaseOptions } from "./database";
import { defaults } from "./defaults";
import Server, { ServerOptions } from "./server";

import { Container, Logger } from "@arkecosystem/core-interfaces";

interface Options {
    enabled: boolean;
    database: DatabaseOptions;
    server: ServerOptions;
}

export const plugin = {
    pkg: require("../package.json"),
    defaults,
    alias: "ark-taco-shop-api",
    register: async (container: Container.IContainer, options: Options) => {
        const logger = container.resolvePlugin<Logger.ILogger>("logger");
        AppContext.logger = logger;
        AppContext.config.coreApi = await container.resolveOptions("api");

        try {
            if (!options.enabled) {
                logger.info("🌮 ark-taco-shop-api is disabled :grey_exclamation:");
                return null;
            }

            await database.setUp(options.database);

            if (options.server.enabled) {
                return Server(options.server);
            }

            logger.info("🌮 ark-taco-shop-api server is disabled :grey_exclamation:");
            return null;
        } catch (error) {
            logger.error("🌮 Error starting ark-taco-shop-api");
            logger.error(error);
            return process.exit(1);
        }
    },
    async deregister(container, options) {
        if (options.server.enabled) {
            container.resolvePlugin("logger").info("🌮 Stopping ark-taco-shop-api");

            return container.resolvePlugin("ark-taco-shop-api").stop();
        }
    },
};
