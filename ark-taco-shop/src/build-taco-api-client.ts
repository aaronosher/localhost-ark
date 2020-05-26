import { Connection } from "@arkecosystem/client";
import { Transactions, Utils } from "@arkecosystem/crypto";
import { ProductParams, TacoApiOptions } from "./interfaces";

export function buildTacoApiClient(config: TacoApiOptions) {
    const { sender, passphrase, recipient, uri } = config;

    return {
        async listTransactions() {
            const client = new Connection(uri);
            const {
                body: { data: transactions = [] } = {}
            } = await client.api("transactions").all({ recipientId: recipient });

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
            const client = new Connection(uri);

            try {
                const transaction = Transactions.BuilderFactory
                    .transfer()
                    .amount(Utils.BigNumber.make(params.price || 0).toFixed())
                    .vendorField(JSON.stringify(params))
                    .recipientId(recipient)
                    .sign(passphrase)
                    .getStruct();

                await client.api("transactions").create({ transactions: [transaction] });

                return transaction;
            } catch (error) {
                throw new Error(`An error has occured while posting the transaction: ${error}`);
            }
        },
    };
}
