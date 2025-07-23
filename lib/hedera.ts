import { Client, AccountId, PrivateKey, Hbar, TransferTransaction, AccountBalanceQuery } from "@hashgraph/sdk";

type Network = "mainnet" | "testnet" | "previewnet";

interface Transfer {
    account: string;
    amount: number;
}

interface TransactionRecord {
    result: string;
    transfers: Transfer[];
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

    async getTransactionAmount(transactionId: string, receiverId: string): Promise<number> {
        let txId = this.parseTransactionId(transactionId);
        const url = `${this.networkUrl}/api/v1/transactions/${txId}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Mirror node fetch failed: ${res.status}`);
        }

        const data: MirrorNodeResponse = await res.json();
        const tx = data.transactions.find((t) => t.result === "SUCCESS") ?? data.transactions[0];

        if (!tx || !tx.transfers) {
            throw new Error("Transaction not found or has no transfer data");
        }

        // Sum up positive amounts (credits), excluding network fee (account 0.0.98)
        const totalTinybar = tx.transfers.filter((t) => t.account === receiverId).reduce((sum, t) => sum + t.amount, 0);

        return totalTinybar / 100_000_000; // Convert tinybar → HBAR
    }
}
