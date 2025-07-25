<template>
    <main class="h-dvh flex justify-center item-center">
        <div class="container flex flex-col justify-center items-center gap-4">
            <div class="bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md pt-8">
                <div class="card__header">
                    <img v-if="image" className="" :src="image" width="60" height="60" />
                    <div v-else>
                        <IconFlash />
                    </div>
                </div>
                <div v-if="route.query.qr" class="flex justify-center border-b border-body/15">
                    <QrCode :value="url" @change="onUrlChange" />
                </div>
                <div class="p-5 flex flex-col gap-4">
                    <h3 class="font-bold text-xl">To pay: {{ link.amount }} {{ link.currency }}</h3>
                    <div>
                        <h4>Description:</h4>
                        <p class="opacity-50">{{ link.name }}</p>
                    </div>

                    <div v-if="link.memo">
                        <h4>Memo (public):</h4>
                        <p class="opacity-50">{{ link.memo }}</p>
                    </div>
                    <div v-if="link.expires">
                        <h4>Pay before:</h4>
                        <p class="opacity-50">{{ new Date(link.expires).toLocaleDateString("en-US") }}</p>
                    </div>
                </div>
                <div class="border-t border-t-body/15 p-5">
                    <div class="flex">
                        <div class="flex flex-grow">
                            <ul>
                                <li>To: <span class="opacity-50">Name Surname</span></li>
                                <li>
                                    Wallet: <span class="opacity-50">{{ link.accountId }}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-if="!route.query.qr" class="btn gap-3">
                            <IconHedera class="-ml-3" /> <span>Pay<span class="hidden md:inline"> now</span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center flex gap-2 items-center relative" @click="copyLink">
                <p class="flex gap-2 items-center opacity-50 cursor-pointer">
                    {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
                </p>
            </div>
        </div>
    </main>
</template>

<script setup>
import { IconHedera } from "#components";
import { QrCode } from "#components";
import { ref, onMounted } from "vue";

// get current url
let url = ref("");

onMounted(() => {
    if (typeof window !== "undefined") {
        url.value = window.location.href.split("?")[0] + "?pay=true";
    }
});

const paymentUrl = ref(null);
const copied = ref(false);

const onUrlChange = (newUrl) => {
    paymentUrl.value = newUrl;
};

const route = useRoute();

let image = null;

const { data: link, error } = await useAsyncData("link", () => $fetch(`/api/links/${route.params.slug}`));

const copyLink = async () => {
    try {
        console.log(window.location.href);
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;

        setTimeout(() => {
            copied.value = false;
        }, 5000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

watchEffect(() => {
    if (link.value) {
        useHead({
            title: link.value.amount + " " + link.value.currency + " to ...",
            meta: [
                {
                    name: "description",
                    content: "HashFast",
                },
            ],
        });
    } else {
        useHead({
            title: "HashFast",
            meta: [
                {
                    name: "description",
                    content: "HashFast",
                },
            ],
        });
    }
});
</script>

<style scoped>
.card {
    &__header {
        position: absolute;
        top: -1.875rem;
        left: calc(50% - 1.875rem);
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50em;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--color-secondary);
    }
}
</style>
