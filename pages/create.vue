<template>
    <main class="">
        <Header :gradient="true" />
        <div class="container flex flex-col justify-center items-center gap-4 pt-40">
            <form
                @submit.prevent="createLink"
                class="block bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md sm:w-md pt-16"
            >
                <div class="card__header" @click="triggerFileInput">
                    <div>
                        <img v-if="imageFile" class="" :src="imageUrl" width="50" height="50" title="Upload icon" />
                        <div v-else>
                            <p>Upload icon</p>
                        </div>
                    </div>

                    <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
                </div>

                <div class="p-5 flex flex-col gap-4">
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <input type="number" v-model="newLink.amount" placeholder="Amount" class="sm:col-span-2" />
                        <select v-model="newLink.currency" class="">
                            <option value="hbar">HBAR</option>
                            <option value="usdc">USDC</option>
                        </select>
                    </div>
                    <div>
                        <input type="text" v-model="newLink.name" placeholder="Description" />
                    </div>
                    <div>
                        <div class="flex gap-2 items-center cursor-pointer font-light" @click="toggleOptionalFields">
                            {{ showOptionalFields ? "Hide" : "More" }} options
                            <svg
                                width="12"
                                height="12"
                                xmlns="http://www.w3.org/2000/svg"
                                :class="{ 'rotate-180': showOptionalFields }"
                            >
                                <path
                                    d="m3 5 3 3 3-3"
                                    stroke="#000"
                                    stroke-width="1.5"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>

                        <div
                            ref="optional-fields"
                            class="opacity-0 invisible h-0 transition-opacity duration-300 ease-in-out flex flex-col gap-3"
                            :class="{ 'opacity-100 h-auto visible': showOptionalFields }"
                        >
                            <div class="pt-4 flex flex-col gap-1">
                                <h4>Memo (public)</h4>
                                <div>
                                    <input type="text" v-model="newLink.memo" />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1">
                                <h4>Expiration date</h4>
                                <input type="date" v-model="newLink.expires" />
                            </div>
                            <div class="flex flex-col gap-1">
                                <h4>Max. payments</h4>
                                <input type="number" v-model="newLink.maxPayments" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t border-t-body/15 p-5">
                    <div class="flex items-center justify-end">
                        <div class="flex flex-grow">
                            <ul>
                                <li>
                                    To: <span class="opacity-50">{{ username }}</span>
                                </li>
                                <li>
                                    Wallet: <span class="opacity-50">{{ newLink.accountId }}</span>
                                </li>
                            </ul>
                        </div>
                        <button type="submit" class="btn gap-3"><span>Save</span></button>
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
let dummyUser = { id: "cmd5pyr950008d4irlpf9xu3j" }; // to do

useHead({
    title: "Create link - HashFast",
});

const fileInput = ref(null);
const username = ref(null);

let imageFile = ref(null); //file
const imageUrl = ref(null);
const showOptionalFields = ref(false);

const newLink = ref({
    authorId: dummyUser.id,
    image: null,
    amount: null,
    currency: "hbar",
    name: null,
    memo: null,
    expires: null,
    maxPayments: null,
    accountId: null,
});

// get user name and wallet
const { data: user } = await useAsyncData("user", () => $fetch(`/api/users/${dummyUser.id}`));

if (user) {
    username.value = user.value.name;
    newLink.value.accountId = user.value.wallet;
}
// username.value = user.value.name;
// newLink.value.accountId = user.value.wallet;

// Generate object URL whenever file changes
watch(imageFile, (newFile) => {
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value); // clean up previous URL
    }
    imageUrl.value = newFile ? URL.createObjectURL(newFile) : null;
});

const toggleOptionalFields = () => {
    showOptionalFields.value = !showOptionalFields.value;
};

const imageFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    } else {
        console.warn("fileInput ref is not set yet");
    }
};

const handleFileChange = async (event) => {
    imageFile.value = event.target.files[0];
    if (imageFile.value) {
        newLink.value.image = await imageFileToBase64(imageFile.value);
    }
};

const createLink = async () => {
    try {
        // console.log(newLink.value);

        newLink.value.expires = newLink.value.expires ? new Date(newLink.value.expires) : null;

        console.log(newLink.value.expires);

        const response = await $fetch("/api/links", {
            method: "POST",
            body: newLink.value,
        });
        console.log(response);

        // go to page dashboard/links
        navigateTo("/dashboard/links");
    } catch (error) {
        console.error("Failed to create link:", error);
    }
};
</script>
