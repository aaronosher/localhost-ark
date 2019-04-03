"use strict";

import { app } from "@arkecosystem/core-container";
import { Logger } from "@arkecosystem/core-interfaces";
import { Server } from "hapi";
import path from "path";
import { ServerOptions } from "../interfaces";
import * as inventoryHandlers from "./handlers/inventory";
import * as productsHandlers from "./handlers/products";
import * as transactionsHandler from "./handlers/transactions";

export async function startServer(options: ServerOptions): Promise<Server> {
    const baseConfig = {
        host: options.host,
        port: options.port,
        routes: {
            cors: true,
            validate: {
                async failAction(request, h, err) {
                    throw err;
                },
            },
        },
    };

    const server = new Server(baseConfig);
    await server.register(require("h2o2"));
    await server.register(require("inert"));

    await server.register({
        plugin: {
            name: "inventory-api",
            version: "0.1.0",
            async register(server: Server) {
                server.route([
                    {
                        method: "GET",
                        path: "/taco/products",
                        ...productsHandlers.index,
                    },
                    {
                        method: "POST",
                        path: "/taco/inventory",
                        ...inventoryHandlers.create,
                    },
                    {
                        method: "POST",
                        // transaction's creation needs to be intercepted
                        path: "/transactions",
                        ...transactionsHandler,
                    },
                    {
                        method: "*",
                        // all the other calls to the core-api can be proxied directly
                        path: "/{path*}",
                        handler: {
                            proxy: {
                                protocol: "http",
                                host: app.resolveOptions("api").host,
                                port: app.resolveOptions("api").port,
                                passThrough: true,
                            },
                        },
                    },
                ]);
            },
        },
        routes: { prefix: "/api" },
        options,
    });

    server.route({
        method: "GET",
        path: "/inventory",
        handler: {
            file: {
                path: path.join(__dirname, "public", "inventory.html"),
                confine: false,
            },
        },
    });

    server.route({
        method: "GET",
        path: "/public/{param*}",
        handler: {
            directory: {
                path: path.join(__dirname, "public"),
                listing: true,
                index: ["index.html", "default.html"],
            },
        },
    });

    await server.start();

    app.resolvePlugin<Logger.ILogger>("logger").info(
        `🌮 ark-taco-shop-api available and listening on ${server.info.uri}`,
    );

    return server;
}
