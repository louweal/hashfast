<template>
    <div class="hero relative h-dvh">
        <Sparkles />
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-5 items-center">
                <div class="md:col-span-5 md:col-start-2 flex flex-col gap-4 text-white">
                    <NuxtLink to="/" class=" flex gap-[10px] items-center text-[18px]"
                        ><svg width="18" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17 7H1m0 0 6-6M1 7l6 6"
                                stroke="#fff"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Back</NuxtLink
                    >

                    <h1 class="text-[38px] font-semibold">Make payments easier for everyone with HashFast</h1>

                    <p>text</p>

                    <div class="btn self-start">Test</div>
                </div>
                <div class="md:col-span-5">
                    <div class="animate-slide-up bg-white flex flex-col gap-4 p-8 rounded-3xl">
                        <h2 class="text-[2rem] font-medium text-body">Register now</h2>
                        <form @submit.prevent="createUser" class="space-y-4">
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    v-model="newUser.email"
                                    type="email"
                                    id="email"
                                    required
                                    class="input-field"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div class="flex flex-col gap-4">
                                <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
                                    >Password</label
                                >
                                <input
                                    v-model="newUser.password1"
                                    type="password"
                                    id="password1"
                                    class="input-field"
                                    placeholder="Password"
                                />
                                <input
                                    v-model="newUser.password2"
                                    type="password"
                                    id="password2"
                                    class="input-field"
                                    placeholder="Password"
                                />
                            </div>
                            <div class="flex gap-4">
                                <button type="submit" :disabled="creating" class="btn">
                                    {{ creating ? "Processing..." : "Register" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const showCreateForm = ref(true);
const creating = ref(false);
const newUser = ref({
    email: "",
    name: "",
});

const createUser = async () => {
    creating.value = true;
    try {
        await $fetch("/api/users", {
            method: "POST",
            body: newUser.value,
        });

        // Reset form and refresh data
        newUser.value = { email: "", password1: "", password2: "" };
        showCreateForm.value = false;
        await refresh();
    } catch (error) {
        console.error("Failed to create user:", error);
    } finally {
        creating.value = false;
    }
};

useHead({
    title: "Register - HashFast",
});
</script>
