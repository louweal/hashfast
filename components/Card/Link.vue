<template>
    <div class="card-link bg-white rounded-2xl shadow-sm hover:bg-background border border-body/10 transition-colors">
        <div class="grid md:grid-cols-12 gap-5 items-center flex-start relative p-5">
            <div class="md:col-span-7 lg:col-span-5 flex items-center gap-4">
                <div class="card-link__circle">
                    <div
                        class="card-link__circle__mask"
                        :style="{
                            background: `conic-gradient(#daedd6 calc(${progress} * 1%),
      transparent 0)`,
                        }"
                    ></div>
                    <div class="card-link__circle__inner">
                        <img v-if="image" className="" :src="image" width="60" height="60" />
                        <div v-else>
                            <IconFlash />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <h3 class="color-body opacity-50 font-regular text-lg">{{ name }}</h3>
                    <span class="color-body/50 text-sm font-light"> {{ memo }}</span>
                </div>
            </div>
            <div class="md:col-span-2 lg:col-span-1 hidden md:flex">{{ amount }} {{ currency }}</div>

            <div class="md:col-span-2 hidden lg:flex">
                {{ new Date(createdAt).toLocaleDateString("en-US") }}
            </div>
            <div class="md:col-span-2 lg:col-span-2 hidden lg:flex items-center gap-2">
                <div class="rounded-md px-3 py-2" :style="`background-color: hsl(${colorHash(accountId)}, 50%, 90%)`">
                    {{ accountId }}
                </div>
            </div>
            <div
                class="md:col-span-2 lg:col-span-1 flex flex-start absolute top-5 right-5 md:relative md:right-auto md:top-auto"
            >
                <div class="bg-primary/20 text-primary rounded-md px-3 py-1 md:py-2" v-if="state == 'waiting'">
                    waiting
                </div>
                <div class="bg-body/20 text-body rounded-sm px-3 py-1 md:py-2" v-else-if="state == 'expired'">
                    expired
                </div>
                <div class="bg-accent/20 text-accent rounded-sm px-3 py-1 md:py-2 whitespace-nowrap" v-else>
                    + {{ totalPayments }} {{ currency }}
                </div>
            </div>
            <div class="md:col-span-1 flex justify-end">
                <IconChevronDown />
            </div>
        </div>
        <div class="xxxhidden-grid-panel">
            <div class="overflow-hidden border-t border-body/15">
                <div class="max-h-[205px] overflow-y-scroll no-scrollbar relative border-b border-body/15">
                    <a
                        href="https://hashscan.io/testnet/transaction/0.0.12345678"
                        target="_blank"
                        v-for="(payment, index) in payments"
                        :key="payment.id"
                        class="grid grid-cols-12 gap-5 items-center bg-background/70 p-5 border-b border-body/15"
                        :class="{ 'border-b-0': index == payments.length - 1 }"
                    >
                        <div class="md:col-span-6 hidden md:block">{{ memo }}</div>
                        <div class="col-span-4 md:col-span-2">
                            7/7/2023 <span class="hidden md:inline">12:33:33</span>
                        </div>
                        <div class="col-span-4 md:col-span-2 flex flex-start">
                            <div
                                class="rounded-md px-3 py-1 md:py-2"
                                :style="`background-color: hsl(${colorHash('0.0.1784003')}, 65%, 92%)`"
                            >
                                0.0.1784003
                            </div>
                        </div>
                        <div class="col-span-4 md:col-span-2 flex flex-start">
                            <div class="bg-accent/20 text-accent rounded-sm px-3 py-1 md:py-2 whitespace-nowrap">
                                + 99 HBAR
                            </div>
                        </div>
                    </a>
                    <!-- <div class="absolute bottom-4 left-0 right-0 flex justify-center" v-if="payments.length > 2">
                        <div class="animate-bounce"><IconChevronDown /></div>
                    </div> -->
                </div>

                <div class="flex gap-5 p-5">
                    <div class="flex flex-grow">
                        Share: <NuxtLink :to="`/link/${id}`" target="_blank">(link)</NuxtLink>
                        <NuxtLink :to="`/link/${id}?qr=true`" target="_blank">(QR)</NuxtLink>
                    </div>
                    <div class="flex">
                        <div class="cursor-pointer"><IconTrash /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";
import IconTrash from "../Icon/Trash.vue";
const hederaService = new HederaService();

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    memo: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
    },
    currency: {
        type: String,
    },
    maxPayments: {
        type: Number,
    },
    payments: {
        type: Array,
        required: false,
    },
    accountId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    expires: {
        type: String,
        required: false,
    },
});

const colorHash = (s) => [...s].reduce((h, c) => h + c.charCodeAt(0), 0) % 360; //  <‑‑ ONE‑LINER

let progress;

if (props.maxPayments && props.payments) {
    let numPayments = props.payments.length;
    progress = (numPayments / props.maxPayments) * 100;
} else {
    progress = 100;
}

let state = "";
let totalPayments = 0;

if (props.payments && props.payments.length > 0) {
    if (props.currency == "HBAR") {
        [...props.payments].map((payment) => {
            hederaService.getTransactionAmount(payment.transactionId, props.accountId).then((amount) => {
                totalPayments += Number(amount);
            });
        });
    } else {
        totalPayments = -1;
    }
} else {
    state = "waiting";
}

if (props.expires) {
    if (new Date(props.expires) < new Date()) {
        state = "expired";
    }
}
</script>

<style scoped>
.card-link {
    &__circle {
        position: relative;
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50em;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--gradient-primary);
        transform: scaleX(-1);

        &__mask {
            position: absolute;
            /* z-index: 2; */
            width: 100%;
            height: 100%;
            border-radius: 50em;
        }

        &__inner {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3.375rem;
            height: 3.375rem;
            padding: 5px;
            border-radius: 50em;
            background-color: var(--color-secondary);
            transform: scaleX(-1);
        }
    }
}
</style>
