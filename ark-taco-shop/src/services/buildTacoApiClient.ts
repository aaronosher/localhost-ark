import Client from "@arkecosystem/client";
import { transactionBuilder } from "@arkecosystem/crypto";

const version = 2;

export interface TacoApiOptions {
    sender: string;
    passphrase: string;
    recipient: string;
    uri: string;
}

interface ProductParams {
    id?: number;
    price: number;
}

async function createAndPostTransaction(
    sender: string,
    passphrase: string,
    recipient: string,
    tacoApiUri: string,
    params: ProductParams,
) {
    const client = new Client(tacoApiUri, version);
    const { price = 0 } = params;

    const senderWallet = await getWallet(sender);
    const recipientWallet = await getWallet(recipient);

    try {
        const transaction = await postTransaction({
            recipient: recipientWallet.address,
            senderPublicKey: senderWallet.address,
            amount: price,
            passphrase,
        });
        return transaction;
    } catch (error) {
        throw error;
    }

    async function getWallet(address) {
        try {
            const { data } = await client.resource("wallets").get(address);
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async function postTransaction({ amount, recipient, senderPublicKey, passphrase }) {
        try {
            const transaction = transactionBuilder
                .transfer()
                .amount(amount)
                .vendorField(JSON.stringify(params))
                .recipientId(recipient)
                .senderPublicKey(senderPublicKey)
                .sign(passphrase)
                .getStruct();

            await client.resource("transactions").create({ transactions: [transaction] });
            return transaction;
        } catch (error) {
            throw new Error(`An error has occured while posting the transaction: ${error}`);
        }
    }
}

async function fetchTransactions(tacoApiUri: string, sender: string, recipientId: string) {
    const client = new Client(tacoApiUri, version);
    const { data: { data: transactions = [] } = {} } = await client.resource("transactions").all({ recipientId });

    const filteredTransactions = (transactions || []).filter(transaction => {
        return !!transaction.vendorField && transaction.sender === sender;
    });
    const {
        data: { data },
    } = await client.resource("transactions").get(filteredTransactions[0].id);

    return filteredTransactions.map(transaction => {
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
        listTransactions: async function listTransactions() {
            try {
                return fetchTransactions(uri, sender, recipient);
            } catch (error) {
                throw error;
            }
        },
        postTransaction: async function postTransaction(params: ProductParams) {
            try {
                const transaction = await createAndPostTransaction(sender, passphrase, recipient, uri, params);
                return transaction;
            } catch (error) {
                throw error;
            }
        },
    };
}
