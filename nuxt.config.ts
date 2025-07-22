// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss"],
    css: ["~/assets/css/main.css"],
    runtimeConfig: {
        // Private keys (only available on server-side)
        databaseUrl: process.env.DATABASE_URL,
        hederaAccountId: process.env.HEDERA_ACCOUNT_ID,
        hederaPrivateKey: process.env.HEDERA_PRIVATE_KEY,
        // Public keys (exposed to client-side)
        public: {
            hederaNetwork: process.env.HEDERA_NETWORK || "testnet",
        },
        jwtSecret: process.env.JWT_SECRET,
    },
    app: {
        head: {
            link: [
                {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
                },
            ],
        },
    },
    nitro: {
        experimental: {
            wasm: true,
        },
    },
    postcss: {
        plugins: {
            "postcss-nested": {},
        },
    },
});
