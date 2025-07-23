<template>
    <NuxtLink :to="to" class="card-link bg-white p-5 rounded-2xl flex gap-4 items-center shadow-sm">
        <div class="card-link__circle">
            <div
                class="card-link__circle__mask"
                :style="{
                    background: `conic-gradient(#daedd6 calc(${progress} * 1%),
      transparent 0)`,
                }"
            ></div>
            <div class="card-link__circle__inner">
                <img v-if="image" className="" :src="logo" width="60" height="60" />
                <div v-else>
                    <svg width="23" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.6 0h11.2l-5.6 11.2h11.2L5.6 28l5.6-11.2H0L5.6 0Z" fill="url(#a)" />
                        <defs>
                            <linearGradient id="a" x1="0" y1="22" x2="22" y2="5.5" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#138462" />
                                <stop offset="1" stop-color="#44A071" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <h3 class="color-body opacity-50 font-regular">{{ description }}</h3>
            <span class="color-body">{{ amount }} {{ currency }}</span>
        </div>
    </NuxtLink>
</template>

<script setup>
import { Payment } from "@prisma/client";

const props = defineProps({
    to: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
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
});

let progress;

if (props.maxPayments && props.payments) {
    let numPayments = props.payments.length;
    progress = (numPayments / props.maxPayments) * 100;
} else {
    progress = 100;
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
