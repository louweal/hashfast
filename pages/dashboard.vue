<template>
    <main>
        <Header />

        <Hero-Dashboard />

        <section class="py-24">
            <div class="container">
                All | Links | Subscriptions

                <br />

                <div class="flex">
                    check | filter1 | filter2 | search |
                    <div class="btn btn--small">New link</div>
                </div>
                <div class="flex flex-col gap-2">
                    <CardLink v-for="link in links" :key="link.id" to="/link/{{ link.id }}" :="link" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
useHead({
    title: "Dashboard - HashFast",
});

let currentUser = { id: "cmcq08j7h0000dp4ofgfpwg4n" }; // to do

// or
const links = await $fetch("/api/links", {
    query: { authorId: currentUser.id }, // filtered
});
</script>
