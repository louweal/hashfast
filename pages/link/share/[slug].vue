<template>
    <main>
        <Header :gradient="true" />

        <section class="section">
            <div class="container flex flex-col justify-center items-center gap-4 pt-40">
                <div class="block bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md sm:w-md">
                    <div class="p-5 flex flex-col gap-4 items-start">
                        <NuxtLink to="/dashboard/links" class="btn gap-2"
                            ><ChevronDown class="rotate-90 -ml-3" /> View Dashboard</NuxtLink
                        >

                        <h1 class="font-bold text-2xl">{{ route.query.new ? "Link created!" : "Share Link" }}</h1>

                        <p>Now you can share the link or show the QR code for direct payment.</p>

                        <div class="flex w-full">
                            <a
                                :href="fullUrl"
                                class="flex flex-grow gap-2 items-center cursor-pointer"
                                @click="handleCopyClick"
                            >
                                {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
                            </a>

                            <NuxtLink :to="fullUrl + '?qr=true'" class="btn btn--small btn--dark flex gap-2"
                                ><IconLink color="#fff" />
                                Show QR
                            </NuxtLink>
                        </div>

                        <SocialShare :permalink="fullUrl" :title="'Payment request: ' + link.name" />
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import ChevronDown from "~/components/Icon/ChevronDown.vue";
import { useRequestURL } from "nuxt/app";

useHead({
    title: "Share Link - HashFast",
});

const copied = ref(false);
const route = useRoute();
const url = useRequestURL();
const fullUrl = url.href;
const params = route.query;

const { data: link } = await useAsyncData("link", () => $fetch(`/api/links/${route.params.slug}`));

function handleCopyClick(event) {
    event.preventDefault();
    copyLink();
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(fullUrl);
        copied.value = true;

        setTimeout(() => {
            copied.value = false;
        }, 5000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};
</script>
