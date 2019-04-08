import { createServer, mountServer } from "@arkecosystem/core-http-utils";
import h2o2 from "h2o2";
import Handlebars from "handlebars";
import inert from "inert";
import Joi from "joi";
import path from "path";
import { URL } from "url";
import Vision from "vision";
import { buildTacoApiClient } from "../build-taco-api-client";
import { ProductParams, ServerOptions, TacoApiOptions } from "../interfaces";

export async function startServer(optsServer: ServerOptions, optsClient: TacoApiOptions) {
    const server = await createServer({ host: optsServer.host, port: optsServer.port });

    await server.register(h2o2);
    await server.register(Vision);
    await server.register(inert);

    server.views({
        engines: {
            html: Handlebars,
        },
        relativeTo: __dirname,
        path: "./public",
    });

    const proxyURL = new URL(optsClient.uri);
    // @ts-ignore
    server.route({
        method: "*",
        path: "/api/taco/{path*}",
        handler: {
            proxy: {
                protocol: proxyURL.protocol,
                host: proxyURL.hostname,
                port: proxyURL.port,
                passThrough: true,
            },
        },
    });

    server.route({
        method: "GET",
        path: "/",
        async handler(_, h) {
            return h.view("index");
        },
    });

    server.route({
        method: "GET",
        path: "/orders",
        async handler(_, h) {
            return h.view("orders");
        },
    });

    server.route({
        method: "GET",
        path: "/api/orders",
        async handler() {
            return {
                results: await buildTacoApiClient(optsClient).listTransactions(),
            };
        },
    });

    server.route({
        method: "POST",
        path: "/api/orders",
        async handler(request) {
            const payload: ProductParams = request.payload as ProductParams;

            return {
                data: await buildTacoApiClient(optsClient).postTransaction({
                    id: payload.id,
                    price: payload.price,
                }),
            };
        },
        options: {
            validate: {
                payload: {
                    id: Joi.number(),
                    price: Joi.number(),
                },
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

    return mountServer("Ark Taco API", server);
}
