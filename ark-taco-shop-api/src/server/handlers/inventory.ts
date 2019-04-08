"use strict";

import { Request, ResponseToolkit } from "hapi";
import { database } from "../../database";
import { ProductAttributes } from "../../interfaces";
import * as schema from "../schema";
import * as utils from "../utils";

export const inventoryHandler = {
    async handler(request: Request, h: ResponseToolkit) {
        const productsToUpsert = (request.payload as ProductAttributes[]) || [];

        const products = await Promise.all(
            productsToUpsert.map((product: ProductAttributes) => {
                const model = database.findByCode(product.code);

                return model ? database.update(model.id, product) : database.create(product);
            }),
        );

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
