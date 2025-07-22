<template>
    <div class="header fixed top-0 left-0 right-0 z-50 py-8">
        <div class="container flex justify-between items-center">
            <Logo />

            <nav>
                <ul class="flex gap-7 items-center text-white">
                    <li><NuxtLink to="/login">Login</NuxtLink></li>
                    <li>
                        <NuxtLink to="/register" class="btn btn--dark btn--small">Get Started</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.header {
    height: var(--header-height);
}
</style>
