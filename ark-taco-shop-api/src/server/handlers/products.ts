"use strict";

import { Request } from "hapi";
import { database } from "../../database";
import { ProductAttributes } from "../../interfaces";
import * as utils from "../utils";

export const productsHandler = {
    handler(request: Request): utils.PaginatedResults<ProductAttributes> {
        const products = database.paginate(utils.paginate(request));

        return utils.toPagination(products);
    },
};
