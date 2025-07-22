<template>
    <div class="hero relative">
        <Sparkles />
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-5 items-center">
                <div class="md:col-span-4 min-height-[600px]">
                    <div class="bg-gray-400 w-full h-[600px] rounded-tl-4xl rounded-tr-4xl text-center">
                        video placeholder
                    </div>
                </div>
                <div class="md:col-span-5 md:col-start-6 flex flex-col gap-4 text-white">
                    <h1 class="font-semibold text-6xl">Fast payments for everyone</h1>
                    <p class="text-2xl font-regular opacity-75">
                        Hedera Hashgraph-powered payment solution, enabling seamless transactions and lorem ipsum dolor
                        sit amet, consectetur adipiscing elit.
                    </p>
                    <NuxtLink to="/register" class="btn self-start">Get Started</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup></script>
