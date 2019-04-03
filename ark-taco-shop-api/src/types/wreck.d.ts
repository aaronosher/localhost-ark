import { WreckObject } from "@types/wreck";

export interface RequestOptions {
    baseUrl?: string;
    socketPath?: string;
    payload?: any;
    headers?: { [key: string]: any };
    redirects?: number;
    redirect303?: boolean;
    beforeRedirect?: (
        redirectMethod: string,
        statusCode: number,
        location: string,
        resHeaders: { [key: string]: any },
        redirectOptions: any,
        next: () => {},
    ) => void;
    redirected?: (statusCode: number, location: string, req: http.ClientRequest) => void;
    timeout?: number;
    maxBytes?: number;
    rejectUnauthorized?: boolean;
    downstreamRes?: any;
    agent?: WreckObject["agents"] | false;
    secureProtocol?: string;
    ciphers?: string;
    events?: boolean;
}
