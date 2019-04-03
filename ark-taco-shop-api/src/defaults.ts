export const defaults = {
    enabled: process.env.ARK_INVENTORY_API_ENABLED || true,
    server: {
        enabled: process.env.ARK_INVENTORY_API_SERVER_ENABLED || true,
        host: process.env.ARK_INVENTORY_API_SERVER_HOST || "0.0.0.0",
        port: process.env.ARK_INVENTORY_API_SERVER_PORT || 5000,
    },
};
