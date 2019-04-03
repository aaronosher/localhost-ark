"use strict";

import { Server } from "hapi";
import path from "path";

import { AppContext } from "../AppContext";
import routes from "./routes";

export interface ServerOptions {
    enabled: boolean;
    host: string;
    port: number;
}

export async function startServer(options: ServerOptions): Promise<Server> {
    const { logger } = AppContext;

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
    await server.register({ plugin: require("h2o2") });
    await server.register(require("inert"));

    await server.register({
        plugin: routes,
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

    logger.info(`🌮 ark-taco-shop-api available and listening on ${server.info.uri}`);

    return server;
}
