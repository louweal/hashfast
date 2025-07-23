<template>
    <div class="hero relative h-dvh">
        <Sparkles />
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-5 items-center">
                <div class="md:col-span-5 md:col-start-2 flex flex-col gap-4 text-white">
                    <NuxtLink to="/" class="flex gap-[10px] items-center text-[18px]"
                        ><svg width="18" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17 7H1m0 0 6-6M1 7l6 6"
                                stroke="#fff"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Back
                    </NuxtLink>

                    <div class="flex-col gap-4 hidden md:flex">
                        <h1 class="text-[38px] font-semibold">Make payments easier for everyone with HashFast</h1>

                        <p>text</p>

                        <div class="btn self-start">Test</div>
                    </div>
                </div>
                <div class="md:col-span-5">
                    <div class="animate-slide-up bg-white p-8 rounded-3xl">
                        <div class="flex flex-col gap-4">
                            <h2 class="text-[2rem] text-body">Register now</h2>
                            <form @submit.prevent="handleLogin" class="space-y-4">
                                <div class="flex flex-col gap-2">
                                    <label for="email" class="block text-body">Email</label>
                                    <input
                                        v-model="email"
                                        type="email"
                                        id="email"
                                        required
                                        class=""
                                        placeholder="user@example.com"
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="password" class="block text-body">Password</label>
                                    <input
                                        v-model="password"
                                        type="password"
                                        id="password"
                                        class=""
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <div class="flex gap-4">
                                    <button type="submit" class="btn">Log in</button>
                                </div>
                                <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const email = ref("");
const password = ref("");
const { login, pending, error } = useAuth();

async function handleLogin() {
    await login(email.value, password.value);
    if (!error.value) {
        navigateTo("/dashboard/links");
    }
}
</script>
