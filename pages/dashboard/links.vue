<template>
    <main>
        <Header />

        <Hero-Dashboard />

        <section class="section">
            <div class="container flex flex-col gap-8">
                <nav class="border-b border-body/20 py-4">
                    <div class="flex gap-4">
                        <NuxtLink
                            to="/dashboard/links"
                            class="px-3 py-2 bg-body/20 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.576 9.305.339 8.433a.452.452 0 0 1-.324-.549.461.461 0 0 1 .558-.324l3.237.872a.45.45 0 0 1-.117.882c-.036 0-.08 0-.117-.01Zm2.383-2.707c.09.09.207.135.324.135a.452.452 0 0 0 .443-.454.462.462 0 0 0-.128-.32L4.224 3.594a.445.445 0 0 0-.639 0 .443.443 0 0 0 0 .63l2.374 2.374ZM8.432 3.81a.45.45 0 0 0 .432.333.53.53 0 0 0 .117-.018.436.436 0 0 0 .315-.549L8.432.34a.448.448 0 0 0-.548-.324.461.461 0 0 0-.324.557l.872 3.238Zm15.235 11.763-3.238-.872a.448.448 0 0 0-.548.324.446.446 0 0 0 .314.548l3.238.873s.08.008.117.008a.44.44 0 0 0 .431-.332.44.44 0 0 0-.314-.549Zm-5.621 1.835a.445.445 0 0 0-.639 0 .444.444 0 0 0 0 .639l2.375 2.365c.08.09.198.135.314.135a.422.422 0 0 0 .315-.136.434.434 0 0 0 0-.629l-2.365-2.374Zm-2.473 2.788a.442.442 0 0 0-.549-.315.448.448 0 0 0-.323.549l.872 3.237a.44.44 0 0 0 .431.333c.037 0 .081 0 .117-.009a.449.449 0 0 0 .315-.557l-.863-3.238Zm6.35-11.485c1.717-1.672 1.77-4.433.098-6.16a4.356 4.356 0 0 0-6.151-.099l-3.597 3.471a.757.757 0 0 0-.018 1.08.773.773 0 0 0 .54.243.9.9 0 0 0 .539-.216l3.597-3.48a2.866 2.866 0 0 1 2.006-.792 2.844 2.844 0 0 1 1.987.863 2.812 2.812 0 0 1-.072 3.984l-5.936 5.747a2.834 2.834 0 0 1-3.993-.072 2.728 2.728 0 0 1-.45-.62.753.753 0 0 0-.458-.369.603.603 0 0 0-.216-.036.78.78 0 0 0-.368.099.766.766 0 0 0-.306 1.034c.186.35.422.671.701.953a4.282 4.282 0 0 0 3.13 1.331 4.303 4.303 0 0 0 3.021-1.223l5.945-5.738Zm-11.287 8.292L7.074 20.44c-.54.521-1.24.8-2.014.791a2.794 2.794 0 0 1-1.979-.854 2.825 2.825 0 0 1 .072-3.993l5.936-5.738c.521-.504 1.232-.783 1.996-.792.765 0 1.466.315 1.997.864.2.206.367.443.494.701a.81.81 0 0 0 .44.387.773.773 0 0 0 .936-1.07 4.433 4.433 0 0 0-.773-1.088 4.305 4.305 0 0 0-3.058-1.322c-.027-.01-.054-.01-.09-.01A4.24 4.24 0 0 0 8.027 9.54l-5.944 5.747a4.348 4.348 0 0 0-.099 6.151 4.316 4.316 0 0 0 3.13 1.331 4.34 4.34 0 0 0 3.021-1.223l3.562-3.444a.757.757 0 0 0 .018-1.08.757.757 0 0 0-1.08-.018Z"
                                    fill="#000"
                                />
                            </svg>
                            Links
                        </NuxtLink>
                        <NuxtLink
                            to="/dashboard/subscriptions"
                            class="px-3 py-2 hover:bg-body/20 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg width="24" height="23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.088 8.207c.574 0 1.04.467 1.04 1.04a.8.8 0 1 0 1.6 0 2.645 2.645 0 0 0-1.84-2.515V5.663a.8.8 0 1 0-1.6 0v1.069a2.646 2.646 0 0 0-1.841 2.516 2.643 2.643 0 0 0 2.641 2.64 1.041 1.041 0 1 1-1.041 1.04.8.8 0 1 0-1.6 0c0 1.177.775 2.176 1.84 2.516v1.068a.8.8 0 1 0 1.601 0v-1.068a2.645 2.645 0 0 0 1.84-2.516 2.643 2.643 0 0 0-2.64-2.64 1.042 1.042 0 0 1-1.041-1.04c0-.574.467-1.041 1.041-1.041Z"
                                    fill="#000"
                                />
                                <path
                                    d="m23.476 6.197-3.387-1.235a.798.798 0 0 0-1.025.477l-1.235 3.387a.8.8 0 1 0 1.503.549l.613-1.682a9.52 9.52 0 0 1 .63 3.395c0 5.232-4.256 9.487-9.487 9.487S1.6 16.32 1.6 11.088s4.257-9.487 9.488-9.487c2.131 0 4.145.69 5.822 1.996a.8.8 0 0 0 .983-1.263A10.977 10.977 0 0 0 11.088 0C4.974.001 0 4.974 0 11.088c0 6.114 4.974 11.087 11.087 11.087 6.114 0 11.087-4.974 11.087-11.087 0-1.345-.25-2.677-.722-3.925l1.474.538a.798.798 0 0 0 1.025-.478.798.798 0 0 0-.478-1.025l.003-.001Z"
                                    fill="#000"
                                />
                            </svg>
                            Subscriptions
                        </NuxtLink>
                    </div>
                </nav>
                <div class="flex gap-5 flex-wrap md:flex-nowrap">
                    <div class="flex gap-2 order-1 flex-grow">
                        <div class="btn">All</div>
                        <div class="btn btn--light">Active</div>
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
                    />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
useHead({
    title: "Dashboard - HashFast",
});

let search;

let currentUser = { id: "cmcq08j7h0000dp4ofgfpwg4n" }; // to do

// or
const links = await $fetch("/api/links", {
    query: { authorId: currentUser.id }, // filtered
});
</script>

<style scoped>
.section {
    padding-top: var(--header-height);
    padding-bottom: 4rem;
}
</style>
