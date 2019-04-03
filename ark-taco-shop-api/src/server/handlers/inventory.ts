"use strict";

import { Request, ResponseToolkit } from "hapi";
import { database } from "../../database";
import { ProductAttributes } from "../../interfaces";
import * as schema from "../schema";
import * as utils from "../utils";

function getFindOrCreateCallback(upsertProduct: ProductAttributes, callback: (product: ProductAttributes) => any) {
    return async function findOrCreateCallback(persistedProduct: ProductAttributes, created: boolean) {
        if (!created) {
            const total = persistedProduct.quantity + upsertProduct.quantity;
            const product = await database.findById(persistedProduct.id);

            const result = await product.update({
                quantity: total,
            });
            callback(result);
        } else {
            callback(persistedProduct);
        }
    };
}

function getFindOrCreatePromise(upsertProduct: ProductAttributes): Promise<ProductAttributes> {
    return new Promise(resolve => {
        return database
            .findOrCreate({
                where: { code: upsertProduct.code },
                defaults: upsertProduct,
            })
            .spread(getFindOrCreateCallback(upsertProduct, resolve));
    });
}

export const create = {
    async handler(request: Request, h: ResponseToolkit) {
        const productsToUpsert = (request.payload as ProductAttributes[]) || [];
        const productsPromises = productsToUpsert.map(getFindOrCreatePromise);

        const products = await Promise.all(productsPromises);

        return h.response(utils.respondWithCollection(products)).code(201);
    },
    options: {
        plugins: {
            pagination: {
                enabled: false,
            },
        },
        validate: schema.createInventory,
    },
};
