<template>
    <div class="hero relative h-dvh hero--center">
        <div class="hero__bg"></div>
        <div class="container z-[2]">
            <div class="grid md:grid-cols-12 gap-5 items-center">
                <div class="md:col-span-5 md:col-start-2 flex flex-col gap-4 text-white md:translate-[-30px]">
                    <NuxtLink to="/dashboard/links" class="flex gap-[10px] items-center text-[18px]">
                        <IconArrowLeft />
                        Back
                    </NuxtLink>

                    <div class="flex-col gap-4 hidden md:flex">
                        <h1 class="text-[38px] font-semibold">Welcome, {{ user.name }}</h1>

                        <!-- {{ user.lastLogin }} -->
                    </div>
                </div>
                <div class="md:col-span-5">
                    <div class="animate-slide-up bg-white p-8 rounded-3xl">
                        <div>
                            <h2 class="text-[2rem] text-body">Your details</h2>

                            <form @submit.prevent="updateUser" class="space-y-4">
                                <div class="flex flex-col gap-2">
                                    <label for="email" class="block text-body">Name</label>
                                    <input v-model="user.name" type="text" id="name" required class="" />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="password" class="block text-body">Hedera Wallet ID</label>
                                    <div class="flex gap-3">
                                        <input
                                            v-model="user.wallet"
                                            type="text"
                                            id="wallet"
                                            class="flex-grow"
                                            placeholder="0.0.1234567"
                                            required
                                        />
                                        <!-- <button class="btn btn--dark btn--square">Detect</button> -->
                                    </div>
                                </div>
                                <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
                                <div class="flex gap-4">
                                    <button type="submit" :disabled="creating" class="btn">
                                        {{ creating ? "Processing..." : "Update" }}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <!-- <div v-else class="flex flex-col gap-4">
                            <h2 class="text-[2rem] text-body">Registration successful!</h2>
                            <p class="text-body">You can now log in with your email and password.</p>

                            <NuxtLink to="/login" class="btn self-start">Login</NuxtLink>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const showDetailsForm = ref(true);
const creating = ref(false);

// fetch user data
const { user, loading, error: userError, isLoggedIn, fetchUser } = useAuth();
await fetchUser();

let error = ref(null);

const updateUser = async () => {
    creating.value = true;
    try {
        if (!user.value.wallet.startsWith("0.0.")) {
            error.value = "Invalid Hedera Wallet ID";
            throw new Error("Invalid Hedera Wallet ID");
        }

        await $fetch("/api/users/" + user.value.id, {
            method: "PATCH",
            body: user.value,
        });
        showDetailsForm.value = false;
        navigateTo("/dashboard/links");
    } catch (error) {
        console.error("Failed to update user:", error);
    } finally {
        creating.value = false;
    }
};
</script>
