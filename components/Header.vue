<template>
    <div class="header fixed top-0 left-0 right-0 z-50 py-3" :class="{ 'header--gradient': gradient }">
        <div class="container flex justify-between items-center">
            <Logo />

            <nav>
                <ul v-if="!user" class="flex gap-7 items-center text-white">
                    <li><NuxtLink to="/dashboard/links">Dashboard</NuxtLink></li>

                    <li><NuxtLink to="/login">Login</NuxtLink></li>
                    <li>
                        <NuxtLink to="/register" class="btn btn--dark btn--small">Get Started</NuxtLink>
                    </li>
                </ul>

                <ul v-else class="flex gap-7 items-center text-white">
                    <li><NuxtLink to="/dashboard/links">Dashboard</NuxtLink></li>

                    <li class="btn btn--dark btn--small" onclick="">Sign out</li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
let user = { id: "cmd5pyr950008d4irlpf9xu3j" }; // to do

const props = defineProps({
    gradient: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.header {
    height: var(--header-height);

    &--gradient {
        background: var(--gradient-primary);
    }
}
</style>
