<template>
    <main class="">
        <Header :gradient="true" />
        <div class="container flex flex-col justify-center items-center gap-4 pt-40">
            <div class="bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md sm:w-md pt-16">
                <div class="card__header">
                    <div @click="triggerFileInput">
                        <img v-if="image" class="" :src="imageUrl" width="50" height="50" title="Upload icon" />
                        <div v-else>
                            <p>Upload icon</p>
                        </div>
                    </div>

                    <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                </div>

                <div class="p-5 flex flex-col gap-4">
                    <div class="grid grid-cols-3 gap-4">
                        <input type="number" v-model="amount" placeholder="Amount" class="col-span-2" />
                        <select v-model="currency" class="">
                            <option value="hbar">HBAR</option>
                            <option value="usdc">USDC</option>
                        </select>
                    </div>
                    <div>
                        <input type="text" v-model="name" placeholder="Description" />
                    </div>

                    <div ref="optional-fields" class="">
                        <h4>Optional</h4>
                        <div>
                            <input type="text" v-model="memo" placeholder="Memo (public, optional)" />
                        </div>
                        <div>
                            <h4>Expiration date (optional)</h4>
                            <input type="date" v-model="expires" placeholder="Expiration date" />
                        </div>
                        <div>
                            <h4>Max. payments (optional)</h4>
                            <input type="number" v-model="maxPayments" placeholder="Max. payments" />
                        </div>
                    </div>
                </div>
                <div class="border-t border-t-body/15 p-5">
                    <div class="flex justify-end">
                        <div class="flex flex-grow">
                            <ul>
                                <li>To: <span class="opacity-50">Name Surname</span></li>
                                <li>Wallet: <span class="opacity-50">0.0.1234</span></li>
                            </ul>
                        </div>
                        <div class="btn gap-3"><span>Save</span></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
useHead({
    title: "Create link - HashFast",
    meta: [
        {
            name: "description",
            content: "HashFast",
        },
    ],
});

import { ref } from "vue";

const fileInput = ref(null);
const expires = ref(null);
const maxPayments = ref(null);
const amount = ref(null);
const currency = ref("hbar");
const name = ref(null);
const memo = ref(null);
let image = ref(null); //file
const imageUrl = ref(null);

// Generate object URL whenever file changes
watch(image, (newFile) => {
    console.log("wtch image", newFile);
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value); // clean up previous URL
    }
    imageUrl.value = newFile ? URL.createObjectURL(newFile) : null;
});

const triggerFileInput = () => {
    console.log("Triggering file input...");
    console.log(fileInput.value);
    if (fileInput.value) {
        fileInput.value.click();
    } else {
        console.warn("fileInput ref is not set yet");
    }
};

const handleFileChange = (event) => {
    image.value = event.target.files[0];
    if (image) {
        console.log("Selected file:", image.name);
    }
};
</script>

<style scoped>
.card {
    &__header {
        position: absolute;
        top: -3.75rem;
        left: calc(50% - 3.75rem);
        width: 7.5rem;
        height: 7.5rem;
        border-radius: 50em;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--color-secondary);
        cursor: pointer;
    }
}
</style>
