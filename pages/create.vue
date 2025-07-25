<template>
    <main class="h-dvh flex justify-center item-center">
        <div class="container flex flex-col justify-center items-center gap-4">
            <div class="bg-white border border-body/10 rounded-2xl relative min-w-full sm:min-w-md pt-8">create</div>
        </div>
    </main>
</template>

<script setup></script>

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
