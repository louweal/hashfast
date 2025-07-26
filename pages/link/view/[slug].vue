<template>
    <main class="min-h-dvh flex justify-center item-center">
        <div class="container flex flex-col justify-center items-center gap-4 w-full sm:w-md">
            <div class="bg-white border border-body/10 rounded-2xl relative pt-14 w-full">
                <div class="card__header">
                    <img v-if="link.image" :src="link.image" width="60" height="60" />
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
                                <li>
                                    To: <span class="opacity-50">{{ receiver.name }}</span>
                                </li>
                                <li>
                                    Wallet: <span class="opacity-50">{{ receiver.wallet }}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-if="!route.query.qr" class="btn gap-3">
                            <IconHedera class="-ml-3" /> <span>Pay<span class="hidden md:inline"> now</span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 w-full items-center relative opacity-60">
                <p class="flex flex-grow gap-2 items-center cursor-pointer" @click="copyLink">
                    {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
                </p>
                <NuxtLink :to="`/link/params/${link.id}`" class="flex gap-2 items-center"
                    ><IconPersons /> Personalize link</NuxtLink
                >
            </div>

            <p>or</p>
            <NuxtLink v-if="route.query.qr" :to="route.path" class="btn btn--small btn--dark"
                >Pay on this device</NuxtLink
            >
            <NuxtLink v-else :to="qrUrl" class="btn btn--small btn--dark">Pay with another device</NuxtLink>
        </div>
    </main>
</template>

<script setup>
import { IconHedera } from "#components";
import { QrCode } from "#components";
import { ref, onMounted } from "vue";
const router = useRouter();
const route = useRoute();

// get current url
let url = ref("");

onMounted(() => {
    if (typeof window !== "undefined") {
        url.value = window.location.href.split("?")[0] + "?pay=true";
    }
});

const paymentUrl = ref(null);
const copied = ref(false);
const qrUrl = ref(route.path + "?qr=true");

const onUrlChange = (newUrl) => {
    paymentUrl.value = newUrl;
};

const { data: link, error } = await useAsyncData("link", () => $fetch(`/api/links/${route.params.slug}`));
const { data: receiver } = await useAsyncData("receiver", () => $fetch(`/api/users/${link.value.authorId}`));

const copyLink = async () => {
    try {
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
    if (link.value && receiver.value) {
        useHead({
            title: "Pay " + link.value.amount + " " + link.value.currency + " to " + receiver.value.name,
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
