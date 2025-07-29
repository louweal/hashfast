<template>
    <div
        class="card-link bg-white rounded-2xl shadow-sm hover:bg-background border border-body/10 transition-colors cursor-pointer"
    >
        <div class="grid md:grid-cols-12 gap-5 items-center flex-start relative p-5" @click="togglePanel">
            <div class="md:col-span-7 lg:col-span-5 flex items-center gap-4">
                <div class="card-link__circle">
                    <div
                        class="card-link__circle__mask"
                        :style="{
                            //background: `conic-gradient(#daedd6 calc(${progress} * 1%),transparent 0)`,
                        }"
                    ></div>
                    <div class="card-link__circle__inner">
                        <img v-if="image" className="" :src="image" width="60" height="60" />
                        <div v-else>
                            <IconFlash />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <h3 class="color-body opacity-50 font-regular text-lg">
                        {{ name }}
                        <i v-if="!name">No description</i>
                    </h3>
                    <span class="color-body/50 text-sm font-normal"> {{ memo }}<i v-if="!memo">No memo</i></span>
                </div>
            </div>
            <div class="md:col-span-2 hidden md:flex">
                {{ amount }} {{ currency !== "*" ? currency.toUpperCase() : "" }}
            </div>

            <div class="md:col-span-2 hidden lg:flex">
                {{ new Date(createdAt).toLocaleDateString("en-US") }}
            </div>
            <!-- <div class="md:col-span-2 lg:col-span-2 hidden lg:flex items-center gap-2">
                <div class="rounded-md px-3 py-2" :style="`background-color: hsl(${colorHash(accountId)}, 50%, 90%)`">
                    {{ accountId }}
                </div>
            </div> -->
            <div class="md:col-span-2 flex flex-start absolute top-5 right-5 md:relative md:right-auto md:top-auto">
                <div class="bg-primary/20 text-primary rounded-md px-3 py-1 md:py-2" v-if="state == 'waiting'">
                    waiting
                </div>
                <div class="bg-body/20 text-body rounded-sm px-3 py-1 md:py-2" v-else-if="state == 'expired'">
                    expired
                </div>
                <div class="bg-accent/20 text-accent rounded-sm px-3 py-1 md:py-2 whitespace-nowrap" v-else>
                    <div v-if="currency == '*'">receiving</div>
                    <div v-else class="uppercase flex gap-2 items-center">
                        + {{ totalAmount }} {{ currency }} <span v-if="isComplete"><IconCheck /></span>
                    </div>
                </div>
            </div>
            <div class="md:col-span-1 flex justify-end">
                <IconChevronDown :class="{ 'rotate-180': showPanel }" class="transform transition-transform" />
            </div>
        </div>
        <div class="hidden-grid-panel" :class="{ 'is-active': showPanel }" ref="panel">
            <div class="overflow-hidden border-t border-body/15">
                <div class="max-h-[205px] overflow-y-scroll no-scrollbar relative">
                    <CardPayment
                        v-for="(payment, index) in payments"
                        :key="payment.transactionId"
                        :="payment"
                        :accountId="accountId"
                    />
                    <!-- <div class="absolute bottom-4 left-0 right-0 flex justify-center" v-if="payments.length > 2">
                        <div class="animate-bounce"><IconChevronDown /></div>
                    </div> -->
                </div>

                <div class="flex gap-5 p-5">
                    <div class="flex flex-grow items-center gap-2">
                        Share:
                        <NuxtLink :to="`/link/view/${id}`" xxxtarget="_blank" class="opacity-50 flex gap-1 items-center"
                            ><IconLink /> Link</NuxtLink
                        >
                        <NuxtLink
                            :to="`/link/view/${id}?qr=true`"
                            xxxtarget="_blank"
                            class="opacity-50 flex gap-1 items-center"
                            ><IconQR /> QR</NuxtLink
                        >
                    </div>
                    <!-- <div v-else class="flex flex-grow">Create link</div> -->
                    <div class="flex">
                        <div class="cursor-pointer" @click="handleDelete(id)"><IconTrash /></div>
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
        type: [String, null],
        required: false,
    },
    memo: {
        type: [String, null],
        required: false,
    },
    image: {
        type: [String, null],
        required: false,
    },
    amount: {
        type: [String, null],
        required: false,
    },
    currency: {
        type: [String, null],
        required: false,
    },
    maxPayments: {
        type: [Number, null],
        required: false,
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
    handleDelete: {
        type: Function,
        required: true,
    },
});

// const colorHash = (s) => [...s].reduce((h, c) => h + c.charCodeAt(0), 0) % 360;

let state = "";
let totalPayments = 0;
let isComplete = props.maxPayments && props.payments.length >= props.maxPayments ? true : false;

// map all payment transactionIds
let paymentIds = props.payments.map((payment) => payment.transactionId);

const totalAmount = ref(0);

if (props.currency != "*") {
    totalAmount.value = await hederaService.getTotalTransactionAmount(paymentIds, props.accountId);
}

if (props.payments && props.payments.length > 0) {
    if (props.currency == "HBAR") {
        [...props.payments].map((payment) => {
            hederaService.getTransactionData(payment.transactionId, props.accountId).amount.then((amount) => {
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

const showPanel = ref(false);

function togglePanel() {
    showPanel.value = !showPanel.value;
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
        /* background: var(--gradient-primary); */
        background-color: var(--color-secondary);

        transform: scaleX(-1);
        padding: 0.75rem;

        /* &__mask {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50em;
        } */

        &__inner {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3.375rem !important;
            height: 3.375rem;
            padding: 5px;
            border-radius: 50em;
            background-color: var(--color-secondary);
            transform: scaleX(-1);
        }
    }
}
</style>
