<template>
    <main>
        <Header :gradient="true" />

        <section class="section">
            <div class="container flex flex-col justify-center items-center gap-4 pt-40">
                <div
                    class="block bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md sm:w-md pt-16"
                >
                    <!-- <div class="card__header">
                        <div>
                            <img v-if="2 == 1" class="" :src="'#'" width="50" height="50" title="Icon" />
                            <div v-else>
                                <IconFlash />
                            </div>
                        </div>
                    </div> -->
                    <div class="p-5 flex flex-col gap-4">
                        <h1 class="font-bold text-2xl">Share</h1>

                        <SocialShare />

                        <NuxtLink to="/dashboard/links" class="btn">View Dashboard</NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
useHead({
    title: "Share Link - HashFast",
});
</script>
