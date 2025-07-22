import { Client } from "@hashgraph/sdk";

export class HederaService {
    private client: Client;

    constructor() {
        const config = useRuntimeConfig();

        // Initialize client based on network
        if (config.public.hederaNetwork === "mainnet") {
            this.client = Client.forMainnet();
        } else {
            this.client = Client.forTestnet();
        }
    }
}
