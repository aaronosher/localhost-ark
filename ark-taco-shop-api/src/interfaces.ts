export interface ProductAttributes {
    id?: number;
    code: string;
    description: string;
    imageUrl: string;
    name: string;
    price: number;
    quantity: number;
}

export interface PartialProductAttributes {
    id?: number;
    code?: string;
    description?: string;
    imageUrl?: string;
    name?: string;
    price?: number;
    quantity?: number;
}

export interface ServerOptions {
    enabled: boolean;
    host: string;
    port: number;
}

export interface PluginOptions {
    enabled: boolean;
    server: ServerOptions;
}
