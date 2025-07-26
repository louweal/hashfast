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
                        <div class="btn" :class="{ 'btn--light': !showAll }" @click="handleFilterAll">All</div>
                        <div class="btn" :class="{ 'btn--light': showAll }" @click="handleFilterActive">Active</div>
                    </div>

                    <input v-model="searchText" type="text" class="!bg-white order-3 md:order-2" placeholder="Search" />

                    <NuxtLink to="/create" class="btn gap-3 order-2 md:order-3">
                        <span class="flex justify-center items-center size-6 bg-black rounded-full -ml-3 text-primary"
                            >+</span
                        >
                        New link</NuxtLink
                    >
                </div>

                <TransitionGroup class="flex flex-col gap-2" name="list" tag="div">
                    <CardLink
                        v-for="(link, index) in filteredLinks"
                        :key="link.id"
                        v-bind="link"
                        :handleDelete="handleDelete"
                    />
                </TransitionGroup>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref } from "vue";

useHead({
    title: "Dashboard - HashFast",
});

const searchText = ref("");
const showAll = ref(true);

let currentUser = { id: "cmd5pyr950008d4irlpf9xu3j" }; // to do

const allLinks = ref(
    await $fetch("/api/links", {
        query: { authorId: currentUser.id }, // filtered
    }),
);

const links = computed(() => {
    return showAll.value ? allLinks.value : allLinks.value.filter((link) => isActiveLink(link));
});

const filteredLinks = computed(() => {
    const term = searchText.value.toLowerCase();
    if (!term) return links.value;
    return links.value.filter((link) => (link.name ? link.name.toLowerCase().includes(term) : false));
});

const handleFilterActive = function () {
    // links.value = links.value.filter((link) => isActiveLink(link));
    showAll.value = false;
};

const handleFilterAll = function () {
    // links.value = allLinks.value;
    showAll.value = true;
};

const handleDelete = async (id) => {
    try {
        await $fetch(`/api/links/${id}`, {
            method: "DELETE",
        });

        allLinks.value = allLinks.value.filter((link) => link.id !== id);
    } catch (error) {
        if (error.statusCode === 400) {
            console.error("Error:", error.message);
        }
    }
};

const isActiveLink = function (link) {
    return link.expires ? new Date(link.expires) > Date.now() : true;
};
</script>

<style scoped>
.section {
    padding-top: var(--header-height);
    padding-bottom: 4rem;
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.3s cubic-bezier(0.2, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    /* transform: translateX(1px); */
}

.list-leave-active {
    position: absolute;
}
</style>
