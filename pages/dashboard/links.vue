<template>
    <main>
        <Header :gradient="true" />

        <section class="section">
            <div class="container flex flex-col gap-8">
                <nav class="border-b border-body/20 py-4">
                    <div class="flex gap-4">
                        <NuxtLink
                            to="/dashboard/links"
                            class="px-3 py-2 bg-body/20 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <IconLinkGlow />
                            Links
                        </NuxtLink>
                        <NuxtLink
                            to="/dashboard/subscriptions"
                            class="px-3 py-2 hover:bg-body/20 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <IconSubscription />
                            Subscriptions
                        </NuxtLink>
                    </div>
                </nav>
                <div class="flex gap-5 flex-wrap md:flex-nowrap">
                    <div class="flex gap-2 order-1 flex-grow">
                        <div class="btn">All</div>
                        <div class="btn btn--light" @click="handleFilterActive">Active</div>
                    </div>

                    <input
                        v-model="search"
                        type="text"
                        class="search !bg-white order-3 md:order-2"
                        placeholder="Search"
                    />

                    <NuxtLink to="/create" class="btn gap-3 order-2 md:order-3">
                        <span class="flex justify-center items-center size-6 bg-black rounded-full -ml-3 text-primary"
                            >+</span
                        >
                        New link</NuxtLink
                    >
                </div>

                <div class="flex flex-col gap-2">
                    <CardLink
                        v-for="(link, index) in links"
                        :key="link.id"
                        :="link"
                        :class="`animate-slide-up`"
                        :style="{ animationDelay: `${index * 50}ms` }"
                        :handleDelete="handleDelete"
                    />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref } from "vue";

useHead({
    title: "Dashboard - HashFast",
});

let search;

let currentUser = { id: "cmd5pyr950008d4irlpf9xu3j" }; // to do

const links = ref(
    await $fetch("/api/links", {
        query: { authorId: currentUser.id }, // filtered
    }),
);

const isActiveLink = function (link) {
    if (link.expires) {
        if (new Date(link.expires) < Date.now()) {
            return false;
        }
    }

    return true;
};

const handleFilterActive = function () {
    links.value = links.value.filter((link) => isActiveLink(link));
};

const handleDelete = async (id) => {
    try {
        await $fetch(`/api/links/${id}`, {
            method: "DELETE",
        });

        links.value = links.value.filter((link) => link.id !== id);
    } catch (error) {
        if (error.statusCode === 400) {
            console.error("Error:", error.message);
        }
    }
};
</script>

<style scoped>
.section {
    padding-top: var(--header-height);
    padding-bottom: 4rem;
}
</style>
