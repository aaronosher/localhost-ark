import { createServer, mountServer } from "@arkecosystem/core-http-utils";
import { Container } from "@arkecosystem/core-interfaces";
import h2o2 from "@hapi/h2o2";
import inert from "@hapi/inert";
import Joi from "@hapi/joi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import { URL } from "url";
import { buildTacoApiClient } from "../build-taco-api-client";
import { ProductParams, ServerOptions, TacoApiOptions } from "../interfaces";

export async function startServer(optsServer: ServerOptions, optsClient: TacoApiOptions) {
    const server = await createServer({ host: optsServer.host, port: optsServer.port });

    // @ts-ignore
    await server.register(h2o2);
    // @ts-ignore
    await server.register(Vision);
    // @ts-ignore
    await server.register(inert);

    // @ts-ignore
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
            // @ts-ignore
            return h.view("index");
        },
    });

    server.route({
        method: "GET",
        path: "/orders",
        async handler(_, h) {
            // @ts-ignore
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

            try {
                return {
                    data: await buildTacoApiClient(optsClient).postTransaction({
                        id: payload.id,
                        price: payload.price,
                    }),
                };
            } catch (error) {
                console.log(error);

                return error;
            }
        },
        options: {
            validate: {
                payload: {
                    id: Joi.string(),
                    price: Joi.number(),
                    ts: Joi.number(),
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
