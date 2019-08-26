"use strict";

import { Container, Logger } from "@arkecosystem/core-interfaces";
import { database } from "./database";
import { defaults } from "./defaults";
import { PluginOptions } from "./interfaces";
import { startServer } from "./server";

export const plugin = {
    pkg: require("../package.json"),
    defaults,
    alias: "ark-taco-shop-api",
    required: true,
    register: async (container: Container.IContainer, options: PluginOptions) => {
        if (!options.enabled) {
            container.resolvePlugin<Logger.ILogger>("logger").info("🌮 ark-taco-shop-api is disabled");
            return null;
        }

        container.resolvePlugin<Logger.ILogger>("logger").info(`🌮 Starting ark-taco-shop-api db`);
        await database.make();


        container.resolvePlugin<Logger.ILogger>("logger").info(`🌮 Starting ark-taco-shop-api http-server`);
        const coreApiOptions = await container.resolveOptions("api");

        const serverOptions = {
            ...options.server,
            coreApi: {
                ...coreApiOptions
            }
        };
        return startServer(serverOptions, container);
    },
    async deregister(container, options) {
        if (options.server.enabled) {
            container.resolvePlugin("logger").info("🌮 Stopping ark-taco-shop-api");

            return container.resolvePlugin("ark-taco-shop-api").stop();
        }
    },
};
