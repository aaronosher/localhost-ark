"use strict";

import { Request } from "hapi";

import { database } from "../../database";
import { ProductAttributes } from "../../interfaces";
import * as utils from "../utils";

export const index = {
    async handler(request: Request): Promise<utils.PaginatedResults<ProductAttributes>> {
        const products = await database.findAndCountAll(utils.paginate(request));

        return utils.toPagination(products);
    },
};
