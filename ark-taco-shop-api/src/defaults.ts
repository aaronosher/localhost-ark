export const defaults = {
    enabled: process.env.ARK_INVENTORY_API_ENABLED || true,
    database: {
        dialect: "postgres",
        host: process.env.ARK_INVENTORY_API_DATABASE_HOST || "localhost",
        port: process.env.ARK_INVENTORY_API_DATABASE_PORT || 5432,
        username: process.env.ARK_INVENTORY_API_DATABASE_USER || "ark",
        password: process.env.ARK_INVENTORY_API_DATABASE_PASSWORD || "password",
        database: process.env.ARK_INVENTORY_API_DATABASE_NAME || "ark_testnet",
    },
    server: {
        enabled: process.env.ARK_INVENTORY_API_SERVER_ENABLED || true,
        host: process.env.ARK_INVENTORY_API_SERVER_HOST || "0.0.0.0",
        port: process.env.ARK_INVENTORY_API_SERVER_PORT || 5000,
    },
};
