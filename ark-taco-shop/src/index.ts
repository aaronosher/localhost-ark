"use strict";

import { Container, Logger } from "@arkecosystem/core-interfaces";
import * as http from "http";
import { buildApp, TacoApiOptions } from "./server";

interface ServerOptions {
    enabled: boolean;
    host: string;
    port: number;
}

interface Options {
    enabled: boolean;
    inventoryApi: TacoApiOptions;
    server: ServerOptions;
}

export const plugin = {
    pkg: require("../package.json"),
    defaults: {
        enabled: process.env.ARK_TACO_SHOP_ENABLED || true,
        server: {
            enabled: process.env.ARK_TACO_SHOP_SERVER_ENABLED || true,
            host: process.env.ARK_TACO_SHOP_SERVER_HOST || "0.0.0.0",
            port: process.env.ARK_TACO_SHOP_SERVER_PORT || 3000,
        },
        inventoryApi: {
            sender: process.env.ARK_TACO_SHOP_API_URL || "AJjv7WztjJNYHrLAeveG5NgHWp6699ZJwD",
            passphrase:
                process.env.ARK_TACO_SHOP_API_URL ||
                "decide rhythm oyster lady they merry betray jelly coyote solve episode then",
            recipient: process.env.ARK_TACO_SHOP_API_URL || "ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo",
            uri: process.env.ARK_TACO_SHOP_API_URL || "http://0.0.0.0:5000",
        },
    },
    alias: "ark-taco-shop",
    async register(container: Container.IContainer, options: Options) {
        const logger = container.resolvePlugin<Logger.ILogger>("logger");
        const config = options.inventoryApi;
        const app = buildApp(config);

        try {
            if (!options.enabled) {
                if (!options.inventoryApi.sender) {
                    throw new Error(
                        'It is necessary to establish the value of the environment variable "ARK_CLIENT_EXAMPLE_SENDER" to an address',
                    );
                }

                if (!options.inventoryApi.passphrase) {
                    throw new Error(
                        'It is necessary to establish the value of the environment variable "ARK_CLIENT_EXAMPLE_PASS" to the passphrase of the "ARK_CLIENT_EXAMPLE_SENDER" address',
                    );
                }

                logger.info("🌮 ark-taco-shop is disabled :grey_exclamation:");

                return;
            }

            if (options.server.enabled) {
                const port = options.server.port;
                app.set("port", port);

                const server = http.createServer(app);
                server.listen(port, () => {
                    const addr = this.address();
                    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
                    logger.info(`🌮 ark-taco-shop available and listening on ${bind}`);
                });

                return;
            }

            logger.info("🌮 ark-taco-shop server is disabled :grey_exclamation:");
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    },
    async deregister(container: Container.IContainer, options: Options) {
        if (options.enabled) {
            container.resolvePlugin("logger").info("🌮 Stopping ark-taco-shop");
            const plugin = container.resolvePlugin("ark-taco-shop");

            if (plugin) {
                return plugin.stop();
            }
        }
    },
};
