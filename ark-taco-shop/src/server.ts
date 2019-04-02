import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import proxy from "http-proxy-middleware";
import path from "path";
import { buildTacoApiClient, TacoApiOptions } from "./services/buildTacoApiClient";

export { TacoApiOptions } from "./services/buildTacoApiClient";

export function buildApp(tacoApiConfig: TacoApiOptions) {
    const app = express();

    /*
     * Proxy calls to ark-taco-shop-api
     * PS: This needs to be set before other middlewares that modify the request
     */
    const target = tacoApiConfig.uri;
    app.use("/api/taco", proxy({ target, changeOrigin: true }));

    app.use(express.json());
    app.use(express.static(path.join(__dirname, "..", "public")));

    app.post("/api/orders", async (req: Request, res: Response) => {
        try {
            const tacoApiClient = buildTacoApiClient(tacoApiConfig);
            const transaction = await tacoApiClient.postTransaction(req.body);
            res.json({ data: transaction });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get("/api/orders", async (req: Request, res: Response) => {
        try {
            const tacoApiClient = buildTacoApiClient(tacoApiConfig);
            const results = await tacoApiClient.listTransactions();
            res.json({ results });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get("/orders", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "..", "/public/orders.html"));
    });

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "/public/index.html"));
    });

    // catch 404 and forward to error handler
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
    });

    // error handler
    app.use((err: any, req: Request, res: Response, next) => {
        console.error(err.message);

        // render the error page
        res.status(err.status || 500);
        res.send("Internal Server Error!");
    });

    return app;
}
