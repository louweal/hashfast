<template>
    <main class="">
        <Header :gradient="true" />
        <div class="container flex flex-col justify-center items-center gap-4 pt-40">
            <form
                @submit.prevent="null"
                class="block bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md sm:w-md pt-16"
            >
                <div class="card__header">
                    <div>
                        <img v-if="link.image" class="" :src="link.image" width="50" height="50" />
                        <div v-else>
                            <IconFlash />
                        </div>
                    </div>
                </div>

                <div class="p-5 flex flex-col gap-4">
                    <h3>Personalize link</h3>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup>
useHead({
    title: "Params - HashFast",
});

const link = ref({
    image: null,
});
</script>
