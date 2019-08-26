export const defaults = {
    enabled: process.env.ARK_TACO_SHOP_ENABLED || true,
    server: {
        enabled: process.env.ARK_TACO_SHOP_SERVER_ENABLED || true,
        host: process.env.ARK_TACO_SHOP_SERVER_HOST || "0.0.0.0",
        port: process.env.ARK_TACO_SHOP_SERVER_PORT || 3000,
    },
    inventoryApi: {
        sender: process.env.ARK_TACO_SHOP_API_URL || "AJjv7WztjJNYHrLAeveG5NgHWp6699ZJwD",
        passphrase:
            process.env.ARK_TACO_SHOP_API_URL ||
            "decide rhythm oyster lady they merry betray jelly coyote solve episode then",
        recipient: process.env.ARK_TACO_SHOP_API_URL || "ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo",
        uri: process.env.ARK_TACO_SHOP_API_URL || "http://0.0.0.0:5000/api",
    },
};
