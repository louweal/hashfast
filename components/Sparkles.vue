<template>
    <div class="sparkles">
        <!-- <sparkle-dot v-for="i in 50" :key="i" /> -->
        <!-- <sparkle-dot v-for="j in 50" :min="66" :key="'j' + j" /> -->
        <!-- <sparkle-dot v-for="k in 50" :min="33" :key="'k' + k" /> -->

        <!-- <sparkle-dot v-for="i in 100" :key="'l' + i" class="d-none d-lg-block" />
        <sparkle-dot v-for="j in 100" :min="66" :key="'m' + j" class="d-none d-lg-block" />
        <sparkle-dot v-for="k in 100" :min="33" :key="'n' + k" class="d-none d-lg-block" /> -->
    </div>
</template>

<style scoped>
.sparkles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    background: var(--gradient-primary);
    overflow: hidden;
}
</style>
