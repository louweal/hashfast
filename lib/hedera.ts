import { Client, AccountId, PrivateKey, Hbar, TransferTransaction, AccountBalanceQuery } from "@hashgraph/sdk";
import type { Link } from "@prisma/client";
import { HashConnect, HashConnectConnectionState } from "hashconnect";
import type { SessionData } from "hashconnect";

import { LedgerId } from "@hashgraph/sdk";

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

    private appMetadata = {
        name: "HashFast",
        description: "HashFast",
        icons: ["http://localhost:3000/favicon.ico"],
        url: "http://localhost:3000/",
    };

    private hashconnect: HashConnect;
    public state: HashConnectConnectionState = HashConnectConnectionState.Disconnected;
    private pairingData?: SessionData | null;

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

        //create the hashconnect instance
        this.hashconnect = new HashConnect(
            LedgerId.TESTNET,
            "27cf4e078673e78af436d3f8b7f33ad8",
            this.appMetadata,
            true,
        );
    }

    async initHashConnect() {
        //register events
        this.setUpHashConnectEvents();

        //initialize
        await this.hashconnect.init();

        //open pairing modal
        this.hashconnect.openPairingModal();

        console.log(this.state);

        // return a boolean to check if we are connected
        return this.state;
    }

    async disconnectHashConnect() {
        await this.hashconnect.disconnect();
    }

    setUpHashConnectEvents() {
        this.hashconnect.pairingEvent.on((newPairing) => {
            this.pairingData = newPairing;
        });

        this.hashconnect.disconnectionEvent.on((data) => {
            this.pairingData = null;
        });

        this.hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
            this.state = connectionStatus;
        });
    }

    isPaired() {
        console.log(this.state);
        return this.state === HashConnectConnectionState.Connected || this.state === HashConnectConnectionState.Paired;
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

    async sendPayment(link: Link) {
        if (!link.accountId) {
            throw new Error("Link does not have an accountId");
        }
        if (!link.amount) {
            throw new Error("Link does not have an amount");
        }
        if (!link.currency) {
            throw new Error("Link does not have a currency");
        }

        let initData = await this.initHashConnect();

        console.log(initData);

        const toAccount = AccountId.fromString(link.accountId);

        if (link.currency == "hbar") {
            const tinybarAmount = Number(link.amount) * 100_000_000;

            console.log("to do hbar transfer");
            return;
        }

        if (link.currency == "usdc") {
            console.log("to do usdc transfer");
        }
    }
}
