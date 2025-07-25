import { Client, AccountId, PrivateKey, Hbar, TransferTransaction, AccountBalanceQuery } from "@hashgraph/sdk";

type Network = "mainnet" | "testnet" | "previewnet";

interface Transfer {
    account: string;
    amount: number;
}

interface TransactionRecord {
    result: string;
    transfers: Transfer[];
    memo: number;
}

interface MirrorNodeResponse {
    transactions: TransactionRecord[];
}

export class HederaService {
    private client: Client;
    private network: String;
    private networkUrl: String;

    constructor() {
        const config = useRuntimeConfig();

        // Initialize client based on network
        if (config.public.hederaNetwork === "mainnet") {
            this.client = Client.forMainnet();
            this.network = "mainnet";
            this.networkUrl = "https://mainnet.mirrornode.hedera.com";
        } else {
            this.client = Client.forTestnet();
            this.network = "testnet";
            this.networkUrl = "https://testnet.mirrornode.hedera.com";
        }
    }

    parseTransactionId(transactionId: string): string {
        const [accountId, timestampPart] = transactionId.split("@");

        if (!accountId || !timestampPart) {
            throw new Error("Invalid Hedera transaction ID");
        }

        // replace the dot between seconds and nanos with a dash
        const timestamp = timestampPart.replace(".", "-");
        return `${accountId}-${timestamp}`;
    }

    async getAllTransactionData(transactionId: string): Promise<any> {
        let txId = this.parseTransactionId(transactionId);
        const url = `${this.networkUrl}/api/v1/transactions/${txId}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Mirror node fetch failed: ${res.status}`);
        }

        const data: MirrorNodeResponse = await res.json();
        console.log(data.transactions[0]);
        return data.transactions[0];
    }

    async getTransactionAmount(transactionId: string, receiverId: string): Promise<number> {
        let paymentData = await this.getAllTransactionData(transactionId);
        let transfers = paymentData["transfers"];

        let amount = 0;
        for (let i = 0; i < transfers.length; i++) {
            if (transfers[i]["account"] == receiverId) {
                amount = Number(transfers[i]["amount"]) / 100_000_000;
                break;
            }
        }

        return amount;
    }

    async getTotalTransactionAmount(paymentIds: string[], receiverId: string): Promise<number> {
        let amount = 0;

        for (let i = 0; i < paymentIds.length; i++) {
            amount += await this.getTransactionAmount(paymentIds[i], receiverId);
        }

        return amount;
    }
}
