import Client from "@arkecosystem/client";
import { transactionBuilder } from "@arkecosystem/crypto";
import { ProductParams, TacoApiOptions } from "./interfaces";

const API_VERSION = 2;

export function buildTacoApiClient(config: TacoApiOptions) {
    const { sender, passphrase, recipient, uri } = config;

    return {
        async listTransactions() {
            const client = new Client(uri, API_VERSION);
            const { data: { data: transactions = [] } = {} } = await client
                .resource("transactions")
                .all({ recipientId: recipient });

            return (transactions || [])
                .filter(transaction => {
                    return !!transaction.vendorField && transaction.sender === sender;
                })
                .map(transaction => {
                    try {
                        return {
                            ...transaction,
                            vendorField: JSON.parse(transaction.vendorField),
                        };
                    } catch (err) {
                        return transaction;
                    }
                });
        },
        async postTransaction(params: ProductParams) {
            const client = new Client(uri, API_VERSION);

            try {
                const transaction = transactionBuilder
                    .transfer()
                    .amount(params.price || 0)
                    .vendorField(JSON.stringify(params))
                    .recipientId(recipient)
                    .sign(passphrase)
                    .getStruct();

                await client.resource("transactions").create({ transactions: [transaction] });

                return transaction;
            } catch (error) {
                throw new Error(`An error has occured while posting the transaction: ${error}`);
            }
        },
    };
}
