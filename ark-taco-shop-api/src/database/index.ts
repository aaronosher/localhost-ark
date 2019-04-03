"use strict";

import { Logger } from "@arkecosystem/core-interfaces";
import path from "path";
import Sequelize from "sequelize";
import Umzug from "umzug";

import { AppContext } from "../AppContext";
import { initProduct, ProductModel } from "./models/product";

function runMigrations(connection) {
    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize: connection,
        },
        migrations: {
            params: [connection.getQueryInterface(), Sequelize],
            path: path.join(__dirname, "migrations"),
        },
    });

    return umzug.up();
}

export type DatabaseOptions = Sequelize.Options;

class Database {
    public connection: Sequelize.Sequelize = null;
    public logger: Logger.ILogger = null;
    public Product: ProductModel = null;

    public executeMigrations = async () => {
        try {
            await runMigrations(this.connection);
        } catch (error) {
            this.logger.error("🌮 Error while running migrations");
            this.logger.error(error);
            throw error;
        }
    };

    public setUpConnection = async (config: DatabaseOptions) => {
        // There is no need to set up again if connection exists
        if (this.connection) {
            return;
        }

        this.connection = new Sequelize(config);

        try {
            await this.connection.authenticate();
        } catch (error) {
            this.logger.error("🌮 Unable to connect to the database");
            this.logger.error(error);

            throw error;
        }
    };

    public setUp = async (config: DatabaseOptions) => {
        this.logger = AppContext.logger;

        await this.setUpConnection(config);
        await this.executeMigrations();
        this.Product = initProduct(this.connection);
    };
}

export const database = new Database();
