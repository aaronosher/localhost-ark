"use strict";

import { Container, Logger } from "@arkecosystem/core-interfaces";
import { defaults } from "./defaults";
import { PluginOptions } from "./interfaces";
import { startServer } from "./server";

export const plugin = {
    pkg: require("../package.json"),
    defaults,
    alias: "ark-taco-shop",
    async register(container: Container.IContainer, options: PluginOptions) {
        if (!options.enabled) {
            container.resolvePlugin<Logger.ILogger>("logger").info("🌮 ark-taco-shop is disabled");
            return;
        }

        if (!options.inventoryApi.sender) {
            container.forceExit(
                'It is necessary to establish the value of the environment variable "ARK_CLIENT_EXAMPLE_SENDER" to an address',
            );
        }

        if (!options.inventoryApi.passphrase) {
            container.forceExit(
                'It is necessary to establish the value of the environment variable "ARK_CLIENT_EXAMPLE_PASS" to the passphrase of the "ARK_CLIENT_EXAMPLE_SENDER" address',
            );
        }

        startServer(options.server, options.inventoryApi);
    },
    async deregister(container: Container.IContainer, options: PluginOptions) {
        if (options.enabled && container.has("ark-taco-shop")) {
            container.resolvePlugin("logger").info("🌮 Stopping ark-taco-shop");

            return container.resolvePlugin("ark-taco-shop").stop();
        }
    },
};
