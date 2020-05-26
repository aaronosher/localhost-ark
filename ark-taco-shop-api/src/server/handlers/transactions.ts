"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";
import Wreck from "@hapi/wreck";
import { database } from "../../database";
import { RequestOptions } from "../../types/wreck";

interface OrderAttributes {
    id: number;
}

function getCoreApiUri(coreApiOptions, path: string, search: string): string {
    const { host, port } = coreApiOptions;

    return `http://${host}:${port}${path || ""}${search || ""}`;
}

function getProxyOptions(request: Request): RequestOptions {
    const options = { headers: {}, payload: request.payload };
    options.headers = Object.assign({}, request.headers);

    // @ts-ignore
    delete options.headers.host;
    delete options.headers["content-length"];

    return options;
}

function proxyToTransactionCreation(request: Request, coreApiOptions): Promise<any> {
    // @ts-ignore -- path doesn't seem to be present in the URL type
    const { path = "", search = "" } = request.url;
    const uri = getCoreApiUri(coreApiOptions, path, search);
    const options = getProxyOptions(request);

    return Wreck.request(request.method, `${uri}/api/v2/transactions`, options);
}

function getOrderFromTransaction(payload: OrderAttributes[] = []): OrderAttributes {
    // @ts-ignore
    return JSON.parse(payload.transactions[0].vendorField);
}

export const buildTransactionsHandler = (coreApiOptions) => ({
    /* Intercepts Ark's transactions proxied call to verify if product has balance */
    async handler(request: Request, h: ResponseToolkit): Promise<object> {
        try {
            const order = getOrderFromTransaction(request.payload as OrderAttributes[]);

            const product = await database.findById(order.id);

            /* If there is not enough balance, we don't create a transaction */
            if (!product || !product.quantity) {
                return h.response({ error: "Product out of stock" }).code(400);
            }

            /* If there is enough balance, we update product's balance and create a transaction */
            await database.update(product.id, { quantity: product.quantity - 1 });

            const res = await proxyToTransactionCreation(request, coreApiOptions);
            return h.response(res).code(res.statusCode);
        } catch (error) {
            return h.response({ error, message: error.message }).code(400);
        }
    },

});
