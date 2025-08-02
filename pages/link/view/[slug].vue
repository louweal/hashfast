<template>
    <main class="min-h-dvh flex justify-center item-center">
        <Header :gradient="true" v-if="user" />

        <div
            class="container flex flex-col justify-center items-center gap-4 w-full sm:w-md"
            :class="{ 'py-40': user }"
        >
            <div class="card bg-white border border-body/10 rounded-2xl relative pt-14 w-full">
                <div class="card__header">
                    <img v-if="link.image" :src="link.image" width="60" height="60" />
                    <div v-else>
                        <IconFlash />
                    </div>
                </div>
                <div v-if="route.query.qr" class="flex justify-center border-b border-body/15">
                    <QrCode :value="url" @change="onUrlChange" />
                </div>
                <div class="p-5 flex flex-col gap-4" v-if="link && baseLink">
                    <h3 class="font-bold text-xl" v-if="baseLink.amount && baseLink.currency">
                        To pay: {{ link.amount }} <span class="uppercase">{{ link.currency }}</span>
                    </h3>
                    <div v-else-if="!isQrUrl" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <input type="text" placeholder="Enter the amount" class="sm:col-span-2" v-model="link.amount" />

                        <input
                            v-if="baseLink.currency != '*' && link.currency"
                            type="text"
                            v-model="link.currency"
                            disabled
                            class="uppercase"
                        />
                        <select v-else v-model="link.currency" default="hbar">
                            <option value="hbar">HBAR</option>
                            <option value="usdc">USDC</option>
                        </select>
                    </div>
                    <div v-else>
                        <p>
                            Scan the QR code to pay with
                            {{ currencies }}.
                        </p>
                    </div>
                    <div v-if="link.name">
                        <h4>Description:</h4>
                        <p class="opacity-50">{{ link.name }}</p>
                    </div>

                    <div v-if="link.memo">
                        <h4>Memo (public):</h4>
                        <p class="opacity-50">{{ link.memo }}</p>
                    </div>
                    <div v-if="link.expires">
                        <h4>Payment due date:</h4>
                        <div class="flex justify-between gap-3 items-center">
                            <p class="opacity-50">{{ new Date(link.expires).toLocaleDateString("en-US") }}</p>
                            <span v-if="expired" class="bg-body/20 text-body rounded-sm px-3">expired</span>
                        </div>
                    </div>
                </div>
                <div v-else>No baseLink</div>
                <div class="border-t border-t-body/15 p-5">
                    <div class="flex items-start">
                        <div class="flex flex-grow" v-if="receiver">
                            <ul v-if="user.wallet != receiver.wallet">
                                <li>
                                    To: <span class="opacity-50">{{ receiver.name }}</span>
                                </li>
                                <li>
                                    Wallet: <span class="opacity-50">{{ receiver.wallet }}</span>
                                </li>
                            </ul>
                        </div>
                        <div
                            v-if="
                                !route.query.qr &&
                                !expired &&
                                ((baseLink.maxPayments && numPayments < baseLink.maxPayments) ||
                                    !baseLink.maxPayments) &&
                                !isPaid
                            "
                            class="btn gap-3"
                            :class="{ 'btn--disabled': !link.amount }"
                            @click="link.amount ? handlePayment() : null"
                        >
                            <IconHedera class="-ml-3" />
                            <span>Pay<span class="hidden md:inline"> now</span></span>
                        </div>
                        <span
                            v-if="baseLink.maxPayments != null && numPayments >= baseLink.maxPayments && !isPaid"
                            class="bg-accent/20 text-accent rounded-sm px-3"
                            >Fully paid</span
                        >
                        <span v-if="isPaid" class="bg-accent/20 text-accent rounded-2xl px-3">Payment received!</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-4 text-center" v-if="!isPaid">
                <p>or</p>
                <NuxtLink v-if="route.query.qr" :to="route.path" class="btn btn--small btn--dark"
                    >Pay on this device</NuxtLink
                >
                <NuxtLink v-else :to="qrUrl" class="btn btn--small btn--dark">Pay with another device</NuxtLink>
            </div>
        </div>
        <div class="bg-white shadow border-t fixed bottom-0 left-0 right-0 p-3" v-if="user">
            <div class="opacity-60 flex gap-2 mx-auto sm:w-md items-center">
                <p class="flex flex-grow gap-2 items-center cursor-pointer" @click="copyLink">
                    {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
                </p>
                <NuxtLink :to="`/link/params/${link.id}`" class="flex gap-2 items-center"
                    ><IconPersons /> Personalize link</NuxtLink
                >
            </div>
        </div>
    </main>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import { IconHedera } from "#components";
import { QrCode } from "#components";
import { ref, onMounted } from "vue";

const route = useRoute();
const slug = computed(() => route.params.slug);
const isPaid = ref(false);

const { data: baseLink, error: linkError } = await useAsyncData("baseLink", () =>
    $fetch(`/api/links/${route.params.slug}`),
);

const hederaService = new HederaService();

const numPayments = baseLink.value.payments ? baseLink.value.payments.length : 0;

const { user, loading, error, isLoggedIn, fetchUser } = useAuth();
await fetchUser();

if (error.value) {
    useError({
        statusCode: error.value.statusCode,
        statusMessage: error.value.message,
    });
}

// get current url
let url = ref("");

// get url params
const encodedParams = route.query;

let params = {};
if (encodedParams && encodedParams.p) {
    params = JSON.parse(atob(encodedParams.p));
}

onMounted(() => {
    if (typeof window !== "undefined") {
        url.value = window.location.href.split("?")[0] + "?pay=true";
    }
});

const paymentUrl = ref(null);
const copied = ref(false);
const qrUrl = ref(route.path + "?qr=true");
const isQrUrl = ref(route.query.qr === "true");

const onUrlChange = (newUrl) => {
    paymentUrl.value = newUrl;
};

const { data: receiver } = await useAsyncData("receiver", () => $fetch(`/api/users/${baseLink.value.authorId}`));

// add url param values to baselink
for (const [key, value] of Object.entries(params)) {
    if (baseLink.value[key] != value) {
        baseLink.value[key] = value;
    }
}

const isExpired = (date) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dateStr = date.split("T")[0];

    return dateStr < todayStr;
};

const expired = baseLink.value && baseLink.value.expires ? ref(isExpired(baseLink.value.expires)) : ref(false);

const link = ref({
    ...baseLink.value,
});

if (link.value.currency == "*") {
    link.value.currency = "hbar";
}

const currencies = link.currency ? link.currency.toUpperCase() : "HBAR or USDC";

let pageTitle = "HashFast";

if (receiver.value) {
    if (link.value.amount && link.value.currency) {
        pageTitle = "Pay " + link.value.amount + " " + link.value.currency.toUpperCase() + " to " + receiver.value.name;
    } else {
        pageTitle = "Pay " + receiver.value.name;
    }
}

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

const handlePayment = async () => {
    try {
        let { transactionId, receipt } = await hederaService.sendPayment(link.value);

        // check if payment was successful
        if (receipt.status._code == 22) {
            // 22 = success

            isPaid.value = true;
            try {
                const response = await $fetch("/api/payments", {
                    method: "POST",
                    body: { transactionId, linkId: link.value.id },
                });
            } catch (error) {
                console.error("Failed to store payment:", error);
            }
        } else {
            console.log(receipt);
        }
    } catch (err) {
        console.error("Failed to send payment:", err);
    }
};

watchEffect(() => {
    useHead({
        title: pageTitle,
    });
});
</script>
