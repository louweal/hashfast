<template>
    <div
        class="sparkle"
        :style="{
            background: randomGradient,
            left: randomXPos,
            top: randomYPos,
            width: randomSize,
            height: randomSize,
            animationDelay: randomDelay,
        }"
    />
</template>

<script>
export default {
    name: "sparkle",

    props: {
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 110,
        },
    },

    computed: {
        randomGradient() {
            return `radial-gradient( circle, ${this.randomRGB(0.25)} 0%, ${this.randomRGB(0.5)} 100%)`;
        },
        randomXPos() {
            return Math.ceil(Math.random() * 100) + "%";
        },
        randomYPos() {
            return this.min + Math.ceil(Math.random() * (this.max - this.min)) + "%";
        },
        randomSize() {
            return 2 + Math.ceil(Math.random() * 6) + "px";
        },
        randomDelay() {
            return Math.ceil(Math.random() * 15) + "s";
        },
    },

    methods: {
        randomColor(min, max) {
            return min + Math.ceil(Math.random() * (max - min));
        },

        randomRGB(opacity) {
            return `rgba(
        ${this.randomColor(0, 200)},
      ${this.randomColor(204, 244)},
      ${this.randomColor(150, 230)}, ${opacity}
      )`;
        },
    },
};
</script>

<style scoped>
.sparkle {
    position: absolute;
    width: 6px;
    height: 6px;
    border: 1px solid (#fff, 0.2);
    border-radius: 50%;
    opacity: 0;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0% {
        transform: scale(10%);
        opacity: 0.3;
    }
    66% {
        transform: scale(100%) translate(0px, -50px);
        opacity: 1;
    }
    100% {
        transform: translateY(-50px);
        opacity: 0;
    }
}
</style>
