import Client from "@arkecosystem/client";
import { transactionBuilder } from "@arkecosystem/crypto";
import { ProductParams, TacoApiOptions } from "./interfaces";

const API_VERSION = 2;

async function createAndPostTransaction(
    passphrase: string,
    recipient: string,
    tacoApiUri: string,
    params: ProductParams,
) {
    const client = new Client(tacoApiUri, API_VERSION);

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
}

async function fetchTransactions(tacoApiUri: string, sender: string, recipientId: string) {
    const client = new Client(tacoApiUri, API_VERSION);
    const { data: { data: transactions = [] } = {} } = await client.resource("transactions").all({ recipientId });

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
}

export function buildTacoApiClient(config: TacoApiOptions) {
    const { sender, passphrase, recipient, uri } = config;

    return {
        async listTransactions() {
            try {
                return fetchTransactions(uri, sender, recipient);
            } catch (error) {
                throw error;
            }
        },
        async postTransaction(params: ProductParams) {
            try {
                const transaction = await createAndPostTransaction(passphrase, recipient, uri, params);
                return transaction;
            } catch (error) {
                throw error;
            }
        },
    };
}
