export interface ServerOptions {
    enabled: boolean;
    host: string;
    port: number;
}

export interface PluginOptions {
    enabled: boolean;
    inventoryApi: TacoApiOptions;
    server: ServerOptions;
}

export interface TacoApiOptions {
    sender: string;
    passphrase: string;
    recipient: string;
    uri: string;
}

export interface ProductParams {
    id?: number;
    price: number;
}
