"use strict";

import { Container, Logger } from "@arkecosystem/core-interfaces";
import h2o2 from "@hapi/h2o2";
import { Server } from "@hapi/hapi";
import inert from "@hapi/inert";
import path from "path";
import { ServerOptions } from "../interfaces";
import { inventoryHandler } from "./handlers/inventory";
import { productsHandler } from "./handlers/products";
import { buildTransactionsHandler } from "./handlers/transactions";

export async function startServer(options: ServerOptions, container: Container.IContainer): Promise<Server> {
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

    // @ts-ignore
    const coreApiOptions = options.coreApi;

    // @ts-ignore
    const server = new Server(baseConfig);
    // @ts-ignore
    await server.register(h2o2);
    // @ts-ignore
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
        ...buildTransactionsHandler(coreApiOptions),
    });

    // @ts-ignore
    server.route({
        method: "*",
        path: "/{path*}",
        handler: {
            proxy: {
                protocol: "http",
                host: coreApiOptions.host,
                port: coreApiOptions.port,
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

    container.resolvePlugin<Logger.ILogger>("logger").info(
        `🌮 ark-taco-shop-api available and listening on ${server.info.uri}`,
    );

    return server;
}
