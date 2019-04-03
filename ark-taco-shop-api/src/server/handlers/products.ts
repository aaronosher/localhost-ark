"use strict";

import { Request } from "hapi";

import { database } from "../../database";
import { ProductInstance } from "../../database/models/product";
import * as utils from "../utils";

export const index = {
    async handler(request: Request): Promise<utils.PaginatedResults<ProductInstance>> {
        const { Product } = database;
        const products = await Product.findAndCountAll(utils.paginate(request));

        return utils.toPagination(products);
    },
};
