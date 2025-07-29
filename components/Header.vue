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
                    <li @click="signOut" class="cursor-pointer whitespace-nowrap">Sign out</li>

                    <li class="btn btn--small btn--dark" @click="isPaired ? disconnect() : connect()">
                        <IconHedera color="#fbda48" class="-ml-2 mr-2" /> {{ isPaired ? "Disconnect" : "Connect" }}
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const hederaService = new HederaService();

const props = defineProps({
    gradient: {
        type: Boolean,
        default: false,
    },
});

// watch the pairing state
const isPaired = ref(hederaService.isPaired());

// watch the pairing state
watch(
    () => hederaService.state,
    (newState) => {
        isPaired.value = newState === "Connected" || newState === "Paired";
    },
);

const connect = async () => {
    try {
        const res = await hederaService.initHashConnect();

        if (res) {
            isPaired.value = true;
        }
    } catch (err) {
        console.error("Failed to connect:", err);
    }
};

const disconnect = async () => {
    try {
        await hederaService.disconnectHashConnect();
    } catch (err) {
        console.error("Failed to disconnect:", err);
    }
};

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

    &--gradient {
        background: var(--gradient-primary);
    }
}
</style>
