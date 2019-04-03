"use strict";

import { Request } from "hapi";

import { database } from "../../database";
import { ProductAttributes } from "../../interfaces";
import * as utils from "../utils";

export const index = {
    handler(request: Request): utils.PaginatedResults<ProductAttributes> {
        const products = database.findAndCountAll(utils.paginate(request));

        return utils.toPagination(products);
    },
};
