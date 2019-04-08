"use strict";

import { app } from "@arkecosystem/core-container";
import { Logger } from "@arkecosystem/core-interfaces";
import h2o2 from "h2o2";
import { Server } from "hapi";
import inert from "inert";
import path from "path";
import { ServerOptions } from "../interfaces";
import { inventoryHandler } from "./handlers/inventory";
import { productsHandler } from "./handlers/products";
import { transactionsHandler } from "./handlers/transactions";

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
    await server.register(h2o2);
    await server.register(inert);

    server.route({
        method: "GET",
        path: "/api/taco/products",
        ...productsHandler,
    });

    server.route({
        method: "POST",
        path: "/api/taco/inventory",
        ...inventoryHandler,
    });

    server.route({
        method: "POST",
        // transaction's creation needs to be intercepted
        path: "/api/transactions",
        ...transactionsHandler,
    });

    // @ts-ignore
    server.route({
        method: "*",
        path: "/{path*}",
        handler: {
            proxy: {
                protocol: "http",
                host: app.resolveOptions("api").host,
                port: app.resolveOptions("api").port,
                passThrough: true,
            },
        },
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
