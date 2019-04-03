"use strict";

import { Request, ResponseToolkit } from "hapi";

import { database } from "../../database";
import { ProductAttributes, ProductInstance } from "../../database/models/product";
import * as schema from "../schema";
import * as utils from "../utils";

function getFindOrCreateCallback(upsertProduct: ProductAttributes, callback: (product: ProductInstance) => any) {
    return async function findOrCreateCallback(persistedProduct: ProductInstance, created: boolean) {
        const { Product } = database;

        if (!created) {
            const total = persistedProduct.quantity + upsertProduct.quantity;
            const product = await Product.findByPk(persistedProduct.id);

            const result = await product.update({
                quantity: total,
            });
            callback(result);
        } else {
            callback(persistedProduct);
        }
    };
}

function getFindOrCreatePromise(upsertProduct: ProductAttributes): Promise<ProductInstance> {
    return new Promise(resolve => {
        const { Product } = database;

        return Product.findOrCreate({
            where: { code: upsertProduct.code },
            defaults: upsertProduct,
        }).spread(getFindOrCreateCallback(upsertProduct, resolve));
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
