<template>
    <div class="header fixed top-0 left-0 right-0 z-50 py-3" :class="{ 'header--gradient': gradient }">
        <div class="container flex justify-between items-center">
            <Logo :homeUrl="user ? '/dashboard/links' : '/'" />

            <nav>
                <ul v-if="!user" class="flex gap-7 items-center text-white">
                    <li><NuxtLink to="/login">Login</NuxtLink></li>
                    <li>
                        <NuxtLink to="/register" class="btn btn--dark btn--small">Get Started</NuxtLink>
                    </li>
                </ul>

                <ul v-else class="flex gap-7 items-center text-white">
                    <li class="cursor-pointer whitespace-nowrap">
                        <NuxtLink to="/account">Account</NuxtLink>
                    </li>

                    <li class="btn btn--small btn--dark" @click="signOut">Sign out</li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
// import { HashConnectConnectionState } from "hashconnect";
import { HederaService } from "~/lib/hedera";
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const hederaService = new HederaService();
const state = hederaService.state;

// init HashConnect
// onMounted(async () => {
//     await hederaService.initHashConnect();
// });

// const isDisconnected = computed(() => state.value === HashConnectConnectionState.Disconnected);

const props = defineProps({
    gradient: {
        type: Boolean,
        default: false,
    },
});

// const connect = async () => {
//     try {
//         if (state.value === "Connected" || state.value === "Paired") {
//             return;
//         }
//         const res = await hederaService.pairHashConnect();
//     } catch (err) {
//         console.error("Failed to connect:", err);
//     }
// };

// const disconnect = async () => {
//     try {
//         if (state.value === "Disconnected") {
//             return;
//         }
//         await hederaService.disconnectHashConnect();
//     } catch (err) {
//         console.error("Failed to disconnect:", err);
//     }
// };

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};
</script>

<style scoped>
.header {
    height: var(--header-height);

    &.header--gradient {
        background: var(--gradient-primary);
    }
}
</style>
